import { Router } from 'express';
import { reportController } from '../controllers/report.controller.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { createReportSchema, resolveReportSchema } from '../validators/report.validator.js';

const router = Router();

router.post('/', optionalAuth, validate(createReportSchema), reportController.create);
router.get('/mine', requireAuth, reportController.listMine);
router.get('/', requireAuth, requireAdmin, reportController.list);
router.post('/:id/resolve', requireAuth, requireAdmin, validate(resolveReportSchema), reportController.resolve);

export default router;