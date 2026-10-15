import { z } from 'zod';

export const createReportSchema = z.object({
  type: z.enum(['review', 'user', 'message', 'task', 'contact', 'other']).default('other'),
  subject: z.string().max(200).optional().default(''),
  description: z.string().min(3).max(8000),
  relatedType: z.string().max(40).optional(),
  relatedId: z.string().max(80).optional()
});

export const resolveReportSchema = z.object({
  status: z.enum(['open', 'reviewing', 'resolved', 'dismissed']),
  resolution: z.string().max(4000).optional().default('')
});