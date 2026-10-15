import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { suspendUserSchema, listAuditSchema } from '../validators/admin.validator.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/dashboard', adminController.dashboard);
router.get('/stats', adminController.stats);
router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.getUser);
router.post('/users/:id/suspend', validate(suspendUserSchema), adminController.suspendUser);
router.post('/users/:id/activate', adminController.activateUser);
router.get('/audit-logs', validate(listAuditSchema, 'query'), adminController.listAuditLogs);

export default router;