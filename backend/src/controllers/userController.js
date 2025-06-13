import UserService from "../services/UserService.js";
const userService = new UserService();

export const signup = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.cookie('jwt', user.token, {
            maxAge: 1 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV !== 'development'
        });
        return res.status(201).json({
            data: user,
            success: true,
            message: 'User created successfully',
            error: null
        });
    } catch (error) {
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
}

export const login = async (req, res) => {
    try {
        const user = await userService.signin(req.body);
        res.cookie('jwt', user.token, {
            maxAge: 1 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV !== 'development'
        });
        return res.status(200).json({
            data: user,
            success: true,
            message: 'User logged in successfully',
            error: null
        });
    } catch (error) {
        if(error.isOperational) {
            return res.status(error.statusCode).json({
                data: {},
                success: false,
                message: error.message,
                error: error.message
            });
        }
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV !== 'development'
        });
        return res.status(200).json({
            data: {},
            success: true,
            message: 'User logged out successfully',
            error: null
        });
    } catch (error) {
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
}

export const updateProfilePic = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { profilePic } = req.body;
        const user = await userService.updateProfilePic(userId, { profilePic });
        return res.status(200).json({
            data: user,
            success: true,
            message: 'Profile picture updated successfully',
            error: null
        });
    } catch (error) {
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Failed to update profile picture',
            error: error.message
        });
    }
}

export const checkAuth = (req, res) => {
    try {
        return res.status(200).json({
            data: req.user,
            success: true,
            message: 'User Authenticated',
            error: null
        });
    } catch (error) {
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Failed to authenticate user',
            error: error.message
        });
    }
}