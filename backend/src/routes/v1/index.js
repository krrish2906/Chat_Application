import express from 'express'
const router = express.Router();

// User Middlewares and Controllers
import { validateUserInfo, validateUserLoginInfo, isAuthenticated } from '../../middlewares/UserMiddleware.js'
import { signup, login, logout, updateProfilePic, checkAuth } from '../../controllers/UserController.js';


// User Routes
router.post('/user/signup', validateUserInfo, signup);
router.post('/user/login', validateUserLoginInfo, login);
router.post('/user/logout', logout);
router.patch('/user/profile/update', isAuthenticated, updateProfilePic);
router.get('/user/auth/verify', isAuthenticated, checkAuth);


export default router;