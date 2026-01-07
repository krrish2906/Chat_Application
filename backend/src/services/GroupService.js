import GroupRepository from "../repository/GroupRepository.js";
import cloudinary from "../config/cloudinaryConfig.js";

class GroupService {
    constructor() {
        this.groupRepository = new GroupRepository();
    }

    async createGroup(data) {
        try {
            const groupData = { ...data };
            if(groupData.image) {
                const base64String = groupData.image.buffer.toString('base64');
                const dataURI = `data:${groupData.image.mimetype};base64,${base64String}`;
                const response = await cloudinary.uploader.upload(dataURI);
                if (!response || !response.secure_url) {
                    throw new Error("Image upload failed");
                }
                groupData.groupImage = response.secure_url;
                delete groupData.image; // Cleanup
            }

            const group = await this.groupRepository.create(groupData);
            return group;
        } catch (error) {
             throw error;
        }
    }

    async getGroups(userId) {
        try {
            return await this.groupRepository.getGroups(userId);
        } catch (error) {
            throw error;
        }
    }
}

export default GroupService;
