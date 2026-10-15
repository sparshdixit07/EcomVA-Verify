import { z } from 'zod';

export const updateVAProfileSchema = z.object({
  headline: z.string().trim().max(160).optional(),
  bio: z.string().max(6000).optional(),
  country: z.string().trim().max(80).optional(),
  timezone: z.string().trim().max(80).optional(),
  languages: z.array(z.string().trim().max(40)).max(20).optional(),
  hourlyRate: z.number().min(0).max(100000).nullable().optional(),
  yearsExperience: z.number().min(0).max(60).nullable().optional(),
  englishLevel: z.enum(['basic', 'conversational', 'professional', 'fluent', 'native']).optional(),
  availability: z.enum(['full_time', 'part_time', 'project', 'hourly']).optional(),
  portfolioUrl: z.string().trim().max(300).optional()
});

export const vaSkillSchema = z.object({
  skillId: z.string().min(1, 'Skill is required'),
  platform: z.enum(['amazon', 'shopify', 'both', 'other']).default('amazon'),
  yearsExperience: z.number().min(0).max(60).default(0),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).default('intermediate')
});

export const vaSearchSchema = z.object({
  q: z.string().trim().max(120).optional(),
  platform: z.string().trim().max(40).optional(),
  skill: z.string().trim().max(120).optional(),
  english: z.string().trim().max(40).optional(),
  verified: z.string().trim().max(10).optional(),
  sort: z.string().trim().max(40).optional(),
  page: z.string().trim().optional(),
  limit: z.string().trim().optional()
});