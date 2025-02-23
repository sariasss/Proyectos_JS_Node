import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { addUser, getUserProfile } from '../controllers/userController.js';

const router = express.Router();

// rutas de usuario
router.post('/', addUser);
router.get('/me', authMiddleware, getUserProfile);

export default router;