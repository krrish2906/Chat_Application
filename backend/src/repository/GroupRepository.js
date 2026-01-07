import CrudRepository from "./CrudRepository.js";
import Group from "../models/Group.js";

class GroupRepository extends CrudRepository {
    constructor() {
        super(Group);
    }

    async getGroups(userId) {
        try {
            const groups = await Group.find({ members: userId })
                .populate('members', '-password')
                .populate('admin', '-password');
            return groups;
        } catch (error) {
            throw error;
        }
    }
}

export default GroupRepository;
