import CrudRepository from "./CrudRepository.js";
import Message from "../models/Message.js";

class MessageRepository extends CrudRepository {
    constructor() {
        super(Message);
    }

    async getChatMessages(user1_id, user2_id) {
        try {
            const messages = await Message.find({
                $or: [
                    { senderId: user1_id, receiverId: user2_id },
                    { senderId: user2_id, receiverId: user1_id }
                ]
            }).sort({ createdAt: 1 });
            return messages;
        } catch (error) {
            throw error;
        }
    }
}

export default MessageRepository;