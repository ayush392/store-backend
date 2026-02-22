import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/rbac.middleware.js';
import { UserRoleEnum } from '../auth/auth.schema.js';
import { staffController } from './staff.controller.js';

const staffRoutes = Router();

staffRoutes.use(requireAuth);
staffRoutes.use(requireRole([UserRoleEnum.enum.OWNER]));

staffRoutes.get('/', staffController.getStaffs);
staffRoutes.post('/', staffController.createStaffWithEmployment);
staffRoutes.post('/:accountId', staffController.createEmployment);
staffRoutes.delete('/:employmentId', staffController.deleteEmployment);

staffRoutes.patch('/attendance/bulk', staffController.markBulkAttendance);
staffRoutes.patch('/attendance', staffController.markAttendance);
staffRoutes.get('/:accountId/attendance', staffController.getAttendance);

export default staffRoutes;
