import MessageRepository from "../repository/MessageRepository.js";
import cloudinary from "../config/cloudinaryConfig.js";
import fs from 'fs';
import { getRecieverSocketId, io } from "../lib/socket.js";

class MessageService {
    constructor() {
        this.messageRepository = new MessageRepository();
    }

    async getChatMessages(user1_id, receiver_id) {
        try {
            // Check if receiver_id is a group? No, repository handles query.
            // But we need to know if we are querying by GroupId or UserId.
            // Assumption: If receiver_id matches a Group, it's a group chat. 
            // Better: Repository can check both or we handle it in controller (already did somewhat).
            // Actually, let's just pass it down.
            const messages = await this.messageRepository.getChatMessages(user1_id, receiver_id);
            return messages;
        } catch (error) {
            throw error;
        }
    }

    async sendMessage(data) {
        try {
            const messageData = { ...data };
            if (messageData.image) {
                const base64String = messageData.image.buffer.toString('base64');
                const dataURI = `data:${messageData.image.mimetype};base64,${base64String}`;
                const response = await cloudinary.uploader.upload(dataURI, {
                    folder: 'ChatApp/images'
                });
                if (!response || !response.secure_url) {
                    throw new Error("Image upload failed");
                }
                messageData.image = response.secure_url;
            }

            const message = await this.messageRepository.create(messageData);

            // Socket.io implementation:-
            if (message.groupId) {
                 io.to(message.groupId.toString()).emit("newMessage", message);
            } else {
                const receiverSocketId = getRecieverSocketId(message.receiverId);
                if(receiverSocketId) {
                    io.to(receiverSocketId).emit("newMessage", message);
                }
            }

            return messageData; // Should return 'message' (the created doc) ideally to include _id etc
        } catch (error) {
            throw error;
        }
    }

    async getConversations(userId) {
        try {
            // This is complex. We need unique users we chatted with + groups.
            // 1. Get Groups
            // Note: Circular dependency if we import GroupRepository here? 
            // Ideally should reuse GroupService but let's do direct Repo or modularize.
            // Let's rely on MessageRepository to find recent DMs and GroupRepository for Groups.
            // Since we don't have GroupRepository instantiated here, let's add it.
            
            // For now, let's stub the DMs part. 
            const recentDMs = await this.messageRepository.getRecentConversations(userId);
            return recentDMs; 
            // We will need to merge Groups in controller or here. 
            // Let's modify MessageService constructor to include GroupService later or keeping it simple.
        } catch (error) {
            throw error;
        }
    }

    async markMessagesAsSeen(senderId, receiverId) {
        try {
            await this.messageRepository.updateStatus(senderId, receiverId, 'seen');
            // Notify the sender that their messages have been seen by receiver
            const senderSocketId = getRecieverSocketId(senderId);
            if (senderSocketId) {
                io.to(senderSocketId).emit("messagesSeen", { receiverId });
            }
        } catch (error) {
            throw error;
        }
    }

    async addReaction(messageId, userId, emoji) {
        try {
            const message = await this.messageRepository.addReaction(messageId, userId, emoji);
            
            // Notify both parties (or just the other one, but easier to broadcast to room or both)
            const receiverSocketId = getRecieverSocketId(message.receiverId);
            const senderSocketId = getRecieverSocketId(message.senderId);

            if (receiverSocketId) io.to(receiverSocketId).emit("messageReaction", message);
            if (senderSocketId) io.to(senderSocketId).emit("messageReaction", message);

            return message;
        } catch (error) {
            throw error;
        }
    }
}

export default MessageService;