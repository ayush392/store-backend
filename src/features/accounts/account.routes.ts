import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/rbac.middleware.js';
import { UserRoleEnum } from '../auth/auth.schema.js';
import { accountController } from './account.controller.js';

const accountRoutes = Router();

accountRoutes.use(requireAuth);

accountRoutes.use(requireRole([UserRoleEnum.enum.OWNER]));

accountRoutes.post('/', accountController.createAccount);
accountRoutes.get('/:accountId', accountController.userProfile);
accountRoutes.patch('/:accountId', accountController.updateAccount);
accountRoutes.patch('/:accountId/activate', accountController.activateAccount);
accountRoutes.delete('/:accountId', accountController.deleteAccount);

export default accountRoutes;
