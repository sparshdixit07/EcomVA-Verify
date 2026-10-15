import { z } from 'zod';

const objectIdRe = /^[0-9a-fA-F]{24}$/;

export const createReviewSchema = z.object({
  engagementId: z.string().regex(objectIdRe, 'Invalid engagement'),
  rating: z.number().min(1).max(5),
  comment: z.string().min(3).max(4000)
});

export const moderateReviewSchema = z.object({
  status: z.enum(['published', 'hidden', 'flagged']),
  reason: z.string().max(2000).optional().default('')
});

export const flagReviewSchema = z.object({
  reason: z.string().min(3).max(2000)
});