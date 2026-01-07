import GroupService from "../services/GroupService.js";

const groupService = new GroupService();

export const createGroup = async (req, res) => {
    try {
        const { name, description, members } = req.body;
        // members is expected to be a JSON stringified array of userIds if coming from multipart form data
        // or array if JSON. Since we might send image, let's assume FormData.
        
        let parsedMembers = [];
        if (typeof members === 'string') {
             parsedMembers = JSON.parse(members);
        } else {
            parsedMembers = members;
        }

        // Add admin (creator) to members
        parsedMembers.push(req.user.userId);

        const groupData = {
            name,
            description,
            admin: req.user.userId,
            members: parsedMembers,
            image: req.file
        };

        const group = await groupService.createGroup(groupData);

        return res.status(201).json({
            data: group,
            success: true,
            message: 'Group created successfully',
            error: null
        });
    } catch (error) {
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Failed to create group',
            error: error.message
        });
    }
}

export const getGroups = async (req, res) => {
    try {
        const groups = await groupService.getGroups(req.user.userId);
        return res.status(200).json({
            data: groups,
            success: true,
            message: 'Groups fetched successfully',
            error: null
        });
    } catch (error) {
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Failed to fetch groups',
            error: error.message
        });
    }
}
