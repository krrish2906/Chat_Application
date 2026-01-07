import MessageService from "../services/MessageService.js";
const messageService = new MessageService();

export const getChatMessages = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id: receiverId } = req.params; // receiverId can be User ID OR Group ID
        
        // We need to determine if receiverId is a Group or User.
        // A simple way is to check if it exists in Group collection, but that adds a DB call.
        // Or we can assume the client tells us? 
        // For now, let's rely on MessageService to handle it (Service will check).
        // Actually, for getChatMessages, we just need messages where (sender=Me, receiver=Target) OR (sender=Target, receiver=Me) OR (groupId=Target)
        
        const messages = await messageService.getChatMessages(userId, receiverId);
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

export const sendMessage = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const messageData = {
            senderId: req.user.userId,
            text: req.body.text,
            image: req.file
        }
        
        // Logic to determine if receiverId is group or user:
        // Client should ideally hit different endpoints or pass a flag, but if we reuse /send/:id
        // We can check if 'receiverId' is a group. 
        // Optimization: Let's pass query param ?isGroup=true from frontend if it's a group.
        
        const isGroup = req.query.isGroup === 'true';

        if (isGroup) {
            messageData.groupId = receiverId;
        } else {
            messageData.receiverId = receiverId;
        }

        const message = await messageService.sendMessage(messageData);
        return res.status(200).json({
            data: message,
            success: true,
            message: 'Successfully sent the message',
            error: null
        });
    } catch (error) {
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Failed to send the message',
            error: error.message
        });
    }
}

export const getConversations = async (req, res) => {
    try {
        const userId = req.user.userId;
        const conversations = await messageService.getConversations(userId);
        return res.status(200).json({
            data: conversations,
            success: true,
            message: 'Conversations fetched successfully',
            error: null
        });
    } catch (error) {
         return res.status(500).json({
            data: [], // Return empty array on error to prevent crash
            success: false,
            message: 'Failed to fetch conversations',
            error: error.message
        });
    }
}

export const markAsSeen = async (req, res) => {
    try {
        const { senderId } = req.body; // The person who sent the messages being seen
        const receiverId = req.user.userId; // The person seeing the messages (current user)
        
        await messageService.markMessagesAsSeen(senderId, receiverId);
        
        return res.status(200).json({
            success: true,
            message: 'Messages marked as seen'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to mark messages as seen',
            error: error.message
        });
    }
}

export const addReaction = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { emoji } = req.body;
        const userId = req.user.userId;

        const message = await messageService.addReaction(messageId, userId, emoji);

        return res.status(200).json({
            data: message,
            success: true,
            message: 'Reaction added'
        });
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: 'Failed to add reaction',
            error: error.message
        });
    }
}