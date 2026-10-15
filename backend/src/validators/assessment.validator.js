import { z } from 'zod';

const objectIdRe = /^[0-9a-fA-F]{24}$/;

export const createAssessmentSchema = z.object({
  title: z.string().trim().min(3).max(160),
  description: z.string().max(2000).optional().default(''),
  skillId: z.string().regex(objectIdRe, 'Invalid skill'),
  platform: z.enum(['amazon', 'shopify', 'both', 'other']).default('both'),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  durationMinutes: z.number().min(5).max(240).default(30),
  passingScore: z.number().min(0).max(100).default(70)
});

export const updateAssessmentSchema = createAssessmentSchema.partial();

export const createQuestionSchema = z.object({
  question: z.string().min(3).max(2000),
  type: z.enum(['single', 'multiple', 'text']).default('single'),
  options: z.array(z.string().max(400)).max(10).default([]),
  correctAnswer: z.string().max(400).default(''),
  explanation: z.string().max(2000).default(''),
  points: z.number().min(1).max(100).default(1),
  order: z.number().min(0).max(1000).default(0)
});

export const updateQuestionSchema = createQuestionSchema.partial();

export const submitAssessmentSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string().regex(objectIdRe, 'Invalid question id'),
    answer: z.string().max(2000)
  })).min(1, 'Answers required')
});