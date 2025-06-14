import MessageRepository from "../repository/MessageRepository.js";
import cloudinary from "../config/cloudinaryConfig.js";
import fs from 'fs';

class MessageService {
    constructor() {
        this.messageRepository = new MessageRepository();
    }

    async getChatMessages(user1_id, user2_id) {
        try {
            const messages = await this.messageRepository.getChatMessages(user1_id, user2_id);
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
                    folder: 'chat/images'
                });
                if (!response || !response.secure_url) {
                    throw new Error("Image upload failed");
                }
                messageData.image = response.secure_url;
            }

            const message = await this.messageRepository.create(messageData);
            // Socket.io implementation
            return messageData;
        } catch (error) {
            throw error;
        }
    }
}

export default MessageService;