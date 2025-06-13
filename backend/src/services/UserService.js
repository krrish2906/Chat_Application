import UserRepository from "../repository/UserRepository.js";
import { hashPassword, generateToken, comparePassword } from '../utils/passwordUtils.js';
import { AuthenticationError, NotFoundError } from '../utils/errors.js'
import cloudinary from "../config/cloudinaryConfig.js";

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async createUser(data) {
        try {
            // Hash password
            const hashedPassword = await hashPassword(data.password);
            const userData = { ...data, password: hashedPassword }
            
            // Create user
            const user = await this.userRepository.create(userData);

            // Generate token
            const payload = {
                userId: user._id,
                fullname: user.fullname,
                email: user.email
            }
            const token = generateToken(payload);

            // Exclude password from response, add token
            const { password, ...userResponse } = user.toObject();
            userResponse.token = token;
            return userResponse;
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    async getUserById(userId) {
        try {
            const user = await this.userRepository.findById(userId);
            return user;
        } catch (error) {
            throw new Error(`Error fetching user: ${error.message}`);
        }
    }

    async getUserByEmail(emailId) {
        try {
            const user = await this.userRepository.findByEmail(emailId);
            if (!user) {
                throw new NotFoundError('User not found');
            }
            return user;
        } catch (error) {
            if (error.isOperational) throw error;
            throw new Error(`Error fetching user by email: ${error.message}`);
        }
    }

    async getAllUsers() {
        try {
            const users = await this.userRepository.findAll();
            return users;
        } catch (error) {
            throw new Error(`Error fetching all users: ${error.message}`);
        }
    }

    async signin(data) {
        try {
            // Find User
            const user = await this.userRepository.findByEmail(data.email);
            if (!user) {
                throw new NotFoundError('User not found');
            }
            
            // Verify password
            const isPasswordValid = await comparePassword(data.password, user.password);
            if (!isPasswordValid) {
                throw new AuthenticationError('Invalid Credentials');
            }

            // Generate token
            const payload = {
                userId: user._id,
                fullname: user.fullname,
                email: user.email
            }
            const token = generateToken(payload);

            // Exclude password from response, add token
            const { password, ...userResponse } = user.toObject();
            userResponse.token = token;
            return userResponse;
        } catch (error) {
            if(error.isOperational) throw error;
            throw new Error(`Error signing in user: ${error.message}`);
        }
    }

    async updateProfilePic(userId, data) {
        try {
            const newProfilePic = data.profilePic;
            const response = await cloudinary.uploader.upload(newProfilePic);
            if (!response || !response.secure_url) {
                throw new Error("Image upload failed");
            }

            const user = await this.userRepository.update(userId, {
                profilePic: response.secure_url
            }, { new: true });
            return user;
        } catch (error) {
            throw error;
        }
    }
}

export default UserService;