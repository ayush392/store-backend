import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/rbac.middleware';
import { UserRoleEnum } from '../auth/auth.schema';
import { staffController } from './staff.controller';

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
