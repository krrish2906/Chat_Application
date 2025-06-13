import express from 'express'
const router = express.Router();

// User Middlewares and Controllers
import { validateUserInfo, validateUserLoginInfo } from '../../middlewares/userMiddleware.js';
import { signup, login, logout } from '../../controllers/userController.js';


// User Routes
router.post('/user/signup', validateUserInfo, signup);
router.post('/user/login', validateUserLoginInfo, login);
router.post('/user/logout', logout);


export default router;