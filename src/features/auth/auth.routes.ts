import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { authController } from './auth.controller.js';

const authRoutes = Router();

authRoutes.post('/login', authController.login);
authRoutes.post('/register', authController.register);
authRoutes.get('/me', requireAuth, authController.myProfile);

export default authRoutes;
