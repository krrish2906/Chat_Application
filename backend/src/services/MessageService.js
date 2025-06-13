import MessageRepository from "../repository/MessageRepository.js";
import UserRepository from "../repository/UserRepository.js";

class MessageService {
    constructor() {
        this.messageRepository = new MessageRepository();
        this.userRepository = new UserRepository();
    }

    async getChatMessages(user1_id, user2_id) {
        try {
            const messages = await this.messageRepository.getChatMessages(user1_id, user2_id);
            return messages;
        } catch (error) {
            throw error;
        }
    }
}

export default MessageService;