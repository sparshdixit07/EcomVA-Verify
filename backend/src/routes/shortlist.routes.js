import { Router } from 'express';
import { shortlistController } from '../controllers/shortlist.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireClient } from '../middleware/rbac.js';

const router = Router();

router.get('/', requireAuth, requireClient, shortlistController.list);
router.post('/', requireAuth, requireClient, shortlistController.add);
router.delete('/:id', requireAuth, requireClient, shortlistController.remove);
router.post('/compare', requireAuth, requireClient, shortlistController.compare);

export default router;