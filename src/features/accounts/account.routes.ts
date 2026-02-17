import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/rbac.middleware';
import { UserRoleEnum } from '../auth/auth.schema';
import { accountController } from './account.controller';

const accountRoutes = Router();

accountRoutes.use(requireAuth);

accountRoutes.use(requireRole([UserRoleEnum.enum.OWNER]));

accountRoutes.post('/', accountController.createAccount);
accountRoutes.get('/:accountId', accountController.userProfile);
accountRoutes.patch('/:accountId', accountController.updateAccount);
accountRoutes.patch('/:accountId/activate', accountController.activateAccount);
accountRoutes.delete('/:accountId', accountController.deleteAccount);

export default accountRoutes;
