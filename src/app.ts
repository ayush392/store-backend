import express from 'express';
import './config/env';
import accountRoutes from './features/accounts/account.routes';
import authRoutes from './features/auth/auth.routes';
import staffRoutes from './features/staff/staff.routes';
import transRoutes from './features/transactions/transaction.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { successResponse } from './shared/successResponse';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (_req, res) => {
  successResponse(res, { message: 'Hello World!', data: null });
});

app.use('/api/v1/user', authRoutes);
app.use('/api/v1/account', accountRoutes);
app.use('/api/v1/transaction', transRoutes);
app.use('/api/v1/staff', staffRoutes);

app.use(errorMiddleware);

export default app;
