import express from 'express';
import { verifyUser } from '../middlewares/VerifyUser.js';
import * as authController from '../controllers/authController.js'

const router = express.Router();

router.post("/signup", authController.createUser)
router.post("/login", authController.loginUser)
router.get('/verify-token', verifyUser, authController.verifyToken);


export default router