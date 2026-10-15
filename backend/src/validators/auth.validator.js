import { z } from 'zod';

const email = z.string().trim().toLowerCase().email('Invalid email');

const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(120, 'Password too long')
  .regex(/[A-Za-z]/, 'Password must contain a letter')
  .regex(/[0-9]/, 'Password must contain a number');

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, 'First name required').max(80),
    lastName: z.string().trim().min(1, 'Last name required').max(80),
    email,
    password,
    role: z.enum(['client', 'va']),
    companyName: z.string().trim().max(160).optional(),
    headline: z.string().trim().max(160).optional(),
    country: z.string().trim().max(80).optional()
  })
  .superRefine((data, ctx) => {
    if (data.role === 'client' && (!data.companyName || !data.companyName.trim())) {
      ctx.addIssue({ code: 'custom', path: ['companyName'], message: 'Company name is required for clients' });
    }
    if (data.role === 'va' && (!data.headline || !data.headline.trim())) {
      ctx.addIssue({ code: 'custom', path: ['headline'], message: 'Headline is required for VAs' });
    }
  });

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password required').max(120)
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z.object({
  token: z.string().min(10, 'Invalid token'),
  password
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password required').max(120),
  newPassword: password
});