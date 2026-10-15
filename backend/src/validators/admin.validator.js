import { z } from 'zod';

export const listUsersSchema = z.object({
  q: z.string().trim().max(120).optional(),
  role: z.enum(['client', 'va', 'admin']).optional(),
  status: z.enum(['pending', 'active', 'suspended', 'deactivated']).optional(),
  page: z.string().optional(),
  limit: z.string().optional()
});

export const suspendUserSchema = z.object({
  reason: z.string().min(3).max(2000)
});

export const listAuditSchema = z.object({
  severity: z.enum(['info', 'warning', 'error', 'critical']).optional(),
  action: z.string().trim().max(80).optional(),
  page: z.string().optional(),
  limit: z.string().optional()
});