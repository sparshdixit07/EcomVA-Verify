import { AdminAction } from '../models/AdminAction.js';
import { logger } from '../config/logger.js';

export async function audit({
  actor,
  action,
  targetType,
  targetId,
  description,
  severity = 'info',
  metadata = {},
  ip
}) {
  try {
    await AdminAction.create({
      actor: actor?._id || actor || null,
      actorEmail: actor?.email || null,
      action,
      targetType: targetType || null,
      targetId: targetId ? String(targetId) : null,
      description: description || '',
      severity,
      metadata,
      ip: ip || null
    });
  } catch (err) {
    logger.warn(`Audit log failed: ${err.message}`);
  }
}