import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';
import { updateMeSchema } from '../validators/user.validator.js';

const router = Router();

router.patch('/me', requireAuth, validate(updateMeSchema), userController.updateMe);
router.post('/me/avatar', requireAuth, upload.single('file'), userController.uploadAvatar);
router.get('/vas/:id', userController.getPublicVA);

export default router;