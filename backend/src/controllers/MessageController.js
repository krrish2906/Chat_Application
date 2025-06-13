import MessageService from "../services/MessageService.js";
const messageService = new MessageService();

export const getChatMessages = async (req, res) => {
    try {
        const userId = req.user.userId;
        const personId = req.params.id;
        const messages = await messageService.getChatMessages(userId, personId);
        return res.status(200).json({
            data: messages,
            success: true,
            message: 'Successfully fetched the chat messages',
            error: null
        });
    } catch (error) {
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Failed to fetch messages',
            error: error.message
        });
    }
}