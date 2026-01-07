import CrudRepository from "./CrudRepository.js";
import Message from "../models/Message.js";
import mongoose from "mongoose";

class MessageRepository extends CrudRepository {
    constructor() {
        super(Message);
    }

    async getChatMessages(user1_id, receiver_id) {
        try {
            // First check if receiver_id is a valid ObjectId
            // Then check if we can interpret it.
            // But simplify: Try to find messages where groupId matches OR sender/receiver matches.
            
            // If we assume receiver_id is EITHER a UserID or GroupID.
            // CASE 1: receiver_id is a group. We find messages with this groupId.
            const groupMessages = await Message.find({ groupId: receiver_id })
                                            .populate('senderId', 'fullname profilePic')
                                            .sort({ createdAt: 1 });
            
            if (groupMessages.length > 0) return groupMessages;

            // CASE 2: receiver_id is a user. standard logic.
            const messages = await Message.find({
                $or: [
                    { senderId: user1_id, receiverId: receiver_id },
                    { senderId: receiver_id, receiverId: user1_id }
                ]
            }).sort({ createdAt: 1 });
            return messages;
        } catch (error) {
            throw error;
        }
    }

    async getRecentConversations(userId) {
        try {
            // Aggregation to find last message exchanged with each user
            // Important: Cast string userId to ObjectId
            const objectIdUserId = new mongoose.Types.ObjectId(userId);

            const recentMessages = await Message.aggregate([
                {
                    $match: {
                        $or: [{ senderId: objectIdUserId }, { receiverId: objectIdUserId }],
                        groupId: { $exists: false } // Only DMs for now
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $group: {
                        _id: {
                            $cond: [
                                { $eq: ["$senderId", objectIdUserId] },
                                "$receiverId",
                                "$senderId"
                            ]
                        },
                        lastMessage: { $first: "$$ROOT" }
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "_id",
                        foreignField: "_id",
                        as: "userDetails"
                    }
                },
                {
                    $unwind: "$userDetails"
                },
                {
                    $project: {
                        _id: 1,
                        username: "$userDetails.username", // schema has fullname?
                        fullname: "$userDetails.fullname",
                        profilePic: "$userDetails.profilePic",
                        lastMessage: 1
                    }
                }, 
                {
                    $sort: { "lastMessage.createdAt": -1 }
                }
            ]);
            
            return recentMessages;
        } catch (error) {
            throw error;
        }
    }

    async updateStatus(senderId, receiverId, status) {
        try {
            await Message.updateMany(
                { senderId, receiverId, status: { $ne: status } },
                { $set: { status } }
            );
        } catch (error) {
            throw error;
        }
    }

    async addReaction(messageId, userId, emoji) {
        try {
            const message = await Message.findById(messageId);
            if (!message) throw new Error("Message not found");

            const existingReactionIndex = message.reactions.findIndex(r => r.userId.toString() === userId.toString());
            
            if (existingReactionIndex > -1) {
                // Update existing reaction
                message.reactions[existingReactionIndex].emoji = emoji;
            } else {
                // Add new reaction
                message.reactions.push({ userId, emoji });
            }
            
            await message.save();
            return message;
        } catch (error) {
            throw error;
        }
    }
}

export default MessageRepository;