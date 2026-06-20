import cors, { CorsOptions } from 'cors';
import express from 'express';
import { env } from './config/env.js';
import accountRoutes from './features/accounts/account.routes.js';
import authRoutes from './features/auth/auth.routes.js';
import staffRoutes from './features/staff/staff.routes.js';
import transRoutes from './features/transactions/transaction.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { successResponse } from './shared/successResponse.js';
import { ForbiddenError } from './shared/appErrors.js';
import miscRoutes from './features/misc/misc.route.js';

const app = express();

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || env.ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new ForbiddenError(`CORS policy: Origin ${origin} not allowed`));
    }
  },
  credentials: true
};

app.get('/', (_req, res) => {
  successResponse(res, { message: 'server is up and running!' });
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/account', accountRoutes);
app.use('/api/v1/transaction', transRoutes);
app.use('/api/v1/staff', staffRoutes);
app.use('/api/v1', miscRoutes);

app.use(errorMiddleware);

export default app;
