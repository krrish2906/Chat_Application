import CrudRepository from "./CrudRepository.js";
import User from '../models/User.js';

class UserRepository extends CrudRepository {
    constructor() {
        super(User);
    }

    async findByEmail(userEmail) {
        try {
            const document = await this.model.findOne({ email: userEmail });
            return document;
        } catch (error) {
            throw new Error(`Error finding user by email: ${error.message}`);
        }
    }
}

export default UserRepository;