import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/rbac.middleware.js';
import { UserRoleEnum } from '../auth/auth.schema.js';
import { transactionController } from './transaction.controller.js';

const transRoutes = Router();

transRoutes.use(requireAuth);
transRoutes.use(requireRole([UserRoleEnum.enum.OWNER]));

transRoutes.post('/', transactionController.createTransaction);
transRoutes.get('/recent', transactionController.recentTransactions);
transRoutes.get('/graph', transactionController.transactionGraph);
transRoutes.patch('/:transactionId', transactionController.editTransaction);
transRoutes.delete('/:transactionId', transactionController.deleteTransaction);
transRoutes.get('/:transactionId', transactionController.transactionHistory);

export default transRoutes;
