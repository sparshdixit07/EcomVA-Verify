import { z } from 'zod';

const objectIdRe = /^[0-9a-fA-F]{24}$/;

export const createTrialTaskSchema = z.object({
  vaId: z.string().regex(objectIdRe, 'Invalid VA id'),
  requirementId: z.string().regex(objectIdRe).optional(),
  title: z.string().trim().min(3).max(200),
  brief: z.string().min(10).max(10000),
  deadline: z.string().min(1, 'Deadline required'),
  compensation: z.number().min(0).max(100000).default(0)
});

export const submitTrialTaskSchema = z.object({
  content: z.string().min(1, 'Submission content required').max(20000)
});

export const reviewTrialTaskSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string().max(4000).default(''),
  passed: z.boolean()
});