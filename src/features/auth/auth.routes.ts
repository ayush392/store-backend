import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { authController } from './auth.controller';

const authRoutes = Router();

authRoutes.post('/login', authController.login);
authRoutes.post('/register', authController.register);
authRoutes.get('/me', requireAuth, authController.myProfile);

export default authRoutes;
