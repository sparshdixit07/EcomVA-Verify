import { asyncHandler } from '../utils/asyncHandler.js';
import { userService } from '../services/user.service.js';
import { fileUrlFor } from '../middleware/upload.js';
import { ApiError } from '../utils/ApiError.js';

export const userController = {
  updateMe: asyncHandler(async (req, res) => {
    const { user } = await userService.updateMe(req.user._id, req.body);
    res.json({ user });
  }),

  uploadAvatar: asyncHandler(async (req, res) => {
    if (!req.file) throw ApiError.badRequest('No file uploaded');
    const url = fileUrlFor(req.file);
    const { user } = await userService.updateAvatar(req.user._id, url);
    res.json({ user, url });
  }),

  getPublicVA: asyncHandler(async (req, res) => {
    const { va } = await userService.getPublicVA(req.params.id);
    res.json({ va });
  })
};