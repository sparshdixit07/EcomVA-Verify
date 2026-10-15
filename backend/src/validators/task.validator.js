import { z } from 'zod';

const objectIdRe = /^[0-9a-fA-F]{24}$/;

export const createTaskSchema = z.object({
  engagementId: z.string().regex(objectIdRe, 'Invalid engagement'),
  title: z.string().trim().min(3).max(200),
  description: z.string().min(3).max(8000),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  deadline: z.string().min(1, 'Deadline required')
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(3).max(200).optional(),
  description: z.string().min(3).max(8000).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  deadline: z.string().optional()
});

export const submitTaskSchema = z.object({
  content: z.string().min(1, 'Submission content required').max(20000)
});

export const revisionSchema = z.object({
  feedback: z.string().min(3).max(4000)
});