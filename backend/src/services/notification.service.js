import { Notification } from '../models/Notification.js';
import { paginated, parsePagination } from '../utils/pagination.js';
import { ApiError } from '../utils/ApiError.js';

export const notificationService = {
  async list(user, query) {
    const { page, limit, skip } = parsePagination(query, { page: 1, limit: 20, maxLimit: 100 });
    const filter = { user: user._id };
    if (query.unread === 'true') filter.read = false;
    const [items, total] = await Promise.all([
      Notification.find(filter).sort('-createdAt').skip(skip).limit(limit),
      Notification.countDocuments(filter)
    ]);
    return paginated(items, total, page, limit);
  },

  async unreadCount(user) {
    const count = await Notification.countDocuments({ user: user._id, read: false });
    return { count };
  },

  async markRead(user, id) {
    const n = await Notification.findOne({ _id: id, user: user._id });
    if (!n) throw ApiError.notFound('Notification not found');
    if (!n.read) {
      n.read = true;
      n.readAt = new Date();
      await n.save();
    }
    return { notification: n };
  },

  async markAllRead(user) {
    await Notification.updateMany(
      { user: user._id, read: false },
      { $set: { read: true, readAt: new Date() } }
    );
    return { ok: true };
  }
};