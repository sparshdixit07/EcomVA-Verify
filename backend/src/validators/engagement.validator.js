import { z } from 'zod';

export const updateEngagementSchema = z.object({
  title: z.string().trim().max(200).optional(),
  rate: z.number().min(0).max(100000).nullable().optional(),
  hoursPerWeek: z.number().min(1).max(80).nullable().optional()
});