import { z } from 'zod';

const objectIdRe = /^[0-9a-fA-F]{24}$/;

export const createRequirementSchema = z.object({
  title: z.string().trim().min(3).max(180),
  description: z.string().min(10).max(8000),
  platform: z.enum(['amazon', 'shopify', 'both', 'other']),
  requiredSkills: z.array(z.string().regex(objectIdRe, 'Invalid skill id')).min(1, 'At least one skill required').max(20),
  englishLevel: z.enum(['basic', 'conversational', 'professional', 'fluent', 'native']).default('professional'),
  timezone: z.string().trim().max(80).optional().default(''),
  availability: z.enum(['full_time', 'part_time', 'project', 'hourly']).default('full_time'),
  budgetMin: z.number().min(0).max(1000000).default(0),
  budgetMax: z.number().min(0).max(1000000).default(0),
  budgetCurrency: z.string().trim().max(10).default('USD'),
  hoursPerWeek: z.number().min(1).max(80).default(40)
});

export const updateRequirementSchema = createRequirementSchema.partial();