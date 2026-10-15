import { Router } from 'express';
import { messageController } from '../controllers/message.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { startConversationSchema, sendMessageSchema } from '../validators/message.validator.js';

const router = Router();

router.get('/conversations', requireAuth, messageController.listConversations);
router.post('/conversations', requireAuth, validate(startConversationSchema), messageController.startConversation);
router.get('/conversations/:id', requireAuth, messageController.getConversation);
router.get('/conversations/:id/messages', requireAuth, messageController.listMessages);
router.post('/conversations/:id/messages', requireAuth, validate(sendMessageSchema), messageController.send);
router.post('/conversations/:id/read', requireAuth, messageController.markRead);

export default router;