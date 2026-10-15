import { asyncHandler } from '../utils/asyncHandler.js';
import { notificationService } from '../services/notification.service.js';

export const notificationController = {
  list: asyncHandler(async (req, res) => {
    const result = await notificationService.list(req.user, req.query);
    res.json(result);
  }),

  unreadCount: asyncHandler(async (req, res) => {
    const result = await notificationService.unreadCount(req.user);
    res.json(result);
  }),

  markRead: asyncHandler(async (req, res) => {
    const result = await notificationService.markRead(req.user, req.params.id);
    res.json(result);
  }),

  markAllRead: asyncHandler(async (req, res) => {
    const result = await notificationService.markAllRead(req.user);
    res.json(result);
  })
};