import { Router } from 'express';
import { clientController } from '../controllers/client.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin, requireClient } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { updateClientProfileSchema } from '../validators/client.validator.js';

const router = Router();

router.get('/me', requireAuth, requireClient, clientController.getMine);
router.put('/me', requireAuth, requireClient, validate(updateClientProfileSchema), clientController.updateMine);
router.get('/me/dashboard', requireAuth, requireClient, clientController.dashboard);
router.get('/', requireAuth, requireAdmin, clientController.list);
router.get('/:id', requireAuth, clientController.getById);

export default router;