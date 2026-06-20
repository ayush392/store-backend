import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/rbac.middleware.js';
import { UserRoleEnum } from '../auth/auth.schema.js';
import { miscController } from './misc.controller.js';

const miscRoutes = Router();

//middlewares
miscRoutes.use(requireAuth);
miscRoutes.use(requireRole([UserRoleEnum.enum.OWNER]));

//cloudinary routes
miscRoutes.post('/cloudinary/signature', miscController.getCloudinarySignature);

//

export default miscRoutes;
