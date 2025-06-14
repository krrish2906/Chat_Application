import CrudRepository from "./CrudRepository.js";
import User from '../models/User.js';

class UserRepository extends CrudRepository {
    constructor() {
        super(User);
    }

    async findByEmail(userEmail) {
        try {
            const document = await User.findOne({ email: userEmail });
            return document;
        } catch (error) {
            throw new Error(`Error finding user by email: ${error.message}`);
        }
    }

    async findAllUsers(userId) {
        try {
            const users = await User.find({
                _id: { $ne: userId }
            }).select('-password');
            return users;
        } catch (error) {
            throw error;
        }
    }

    async findById(userId) {
        try {
            const user = await User.findById(userId).select('-password');
            return user;
        } catch (error) {
            throw error;
        }
    }
}

export default UserRepository;