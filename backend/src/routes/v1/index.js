import express from 'express'
const router = express.Router();

// User Middlewares and Controllers:-
import { singleUploader, multiUploader } from '../../middlewares/MulterMiddleware.js';
import { validateUserInfo, validateUserLoginInfo, isAuthenticated } from '../../middlewares/UserMiddleware.js'
import { signup, login, logout, updateProfilePic, checkAuth,
    findUsersforSidebar, fetchUser } from '../../controllers/UserController.js';

// User Routes:-
router.post('/user/signup', validateUserInfo, signup);
router.post('/user/login', validateUserLoginInfo, login);
router.post('/user/logout', logout);
router.patch('/user/profile/update', isAuthenticated, singleUploader, updateProfilePic);
router.get('/user/auth/verify', isAuthenticated, checkAuth);
router.get('/users', isAuthenticated, findUsersforSidebar);
router.get('/user', isAuthenticated, fetchUser);


// Messages Middlewares and Controllers:-
import { getChatMessages, sendMessage } from '../../controllers/MessageController.js';

// Message Routes:-
router.get('/messages/:id', isAuthenticated, getChatMessages);
router.post('/send/:id', isAuthenticated, singleUploader, sendMessage);

export default router;
