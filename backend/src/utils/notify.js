import { Notification } from '../models/Notification.js';
import { logger } from '../config/logger.js';

export async function notify({
  user,
  type,
  title,
  message,
  link,
  relatedType,
  relatedId,
  metadata = {}
}) {
  if (!user) return null;
  try {
    return await Notification.create({
      user,
      type,
      title,
      message,
      link: link || null,
      relatedType: relatedType || null,
      relatedId: relatedId ? String(relatedId) : null,
      metadata
    });
  } catch (err) {
    logger.warn(`Notification failed: ${err.message}`);
    return null;
  }
}

export async function notifyMany(userIds, payload) {
  const ids = [...new Set(userIds.filter(Boolean).map(String))];
  await Promise.all(ids.map((id) => notify({ user: id, ...payload })));
}