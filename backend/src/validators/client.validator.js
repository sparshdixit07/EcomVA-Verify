import { z } from 'zod';

export const updateClientProfileSchema = z.object({
  companyName: z.string().trim().max(160).optional(),
  website: z.string().trim().max(300).optional(),
  platform: z.enum(['amazon', 'shopify', 'both', 'other', '']).optional(),
  country: z.string().trim().max(80).optional(),
  timezone: z.string().trim().max(80).optional(),
  contactEmail: z.string().trim().email().optional().or(z.literal('')),
  about: z.string().max(4000).optional(),
  categories: z.array(z.string().trim().max(60)).max(30).optional()
});