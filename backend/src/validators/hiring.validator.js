import { z } from 'zod';

const objectIdRe = /^[0-9a-fA-F]{24}$/;

export const createHiringSchema = z.object({
  vaId: z.string().regex(objectIdRe, 'Invalid VA id'),
  requirementId: z.string().regex(objectIdRe).optional(),
  trialTaskId: z.string().regex(objectIdRe).optional(),
  message: z.string().max(4000).optional().default(''),
  proposedRate: z.number().min(0).max(100000).optional(),
  hoursPerWeek: z.number().min(1).max(80).optional(),
  startDate: z.string().optional()
});

export const rejectHiringSchema = z.object({
  reason: z.string().max(2000).optional().default('')
});