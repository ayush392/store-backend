import express from 'express';
import './config/env.js';
import accountRoutes from './features/accounts/account.routes.js';
import authRoutes from './features/auth/auth.routes.js';
import staffRoutes from './features/staff/staff.routes.js';
import transRoutes from './features/transactions/transaction.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { successResponse } from './shared/successResponse.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (_req, res) => {
  successResponse(res, { message: 'Hello World!', data: null });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/account', accountRoutes);
app.use('/api/v1/transaction', transRoutes);
app.use('/api/v1/staff', staffRoutes);

app.use(errorMiddleware);

export default app;
