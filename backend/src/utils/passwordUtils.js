import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serverConfig } from '../config/serverConfig.js';

export const hashPassword = async (password) => {
    try {
        const saltRounds = parseInt(serverConfig.SALT_ROUNDS);
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt)
        return hashedPassword;
    } catch (error) {
        throw new Error(`Error hashing password: ${error.message}`);
    }
}

export const comparePassword = async (password, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        throw new Error(`Error comparing password: ${error.message}`);
    }
}

export const generateToken = (payload) => {
    try {
        const token = jwt.sign(payload, serverConfig.JWT_SECRET, {
            expiresIn: '7d'
        });
        return token;
    } catch (error) {
        throw new Error(`Error generating token: ${error.message}`);
    }
}

export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, serverConfig.JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error(`Error verifying token: ${error.message}`);
    }
}