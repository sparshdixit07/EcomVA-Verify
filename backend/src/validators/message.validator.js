import { z } from 'zod';

const objectIdRe = /^[0-9a-fA-F]{24}$/;

export const startConversationSchema = z.object({
  vaId: z.string().regex(objectIdRe, 'Invalid VA id').optional(),
  clientId: z.string().regex(objectIdRe, 'Invalid client id').optional()
});

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message required').max(8000)
});