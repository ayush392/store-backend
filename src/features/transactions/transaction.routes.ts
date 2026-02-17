import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/rbac.middleware';
import { UserRoleEnum } from '../auth/auth.schema';
import { transactionController } from './transaction.controller';

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
