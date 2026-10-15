import { User } from '../models/User.js';
import { VAProfile } from '../models/VAProfile.js';
import { ApiError } from '../utils/ApiError.js';

export const userService = {
  async updateMe(userId, payload) {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound('User not found');
    if (payload.firstName !== undefined) user.firstName = payload.firstName;
    if (payload.lastName !== undefined) user.lastName = payload.lastName;
    if (payload.phone !== undefined) user.phone = payload.phone;
    await user.save();
    return { user };
  },

  async updateAvatar(userId, url) {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound('User not found');
    user.avatarUrl = url;
    await user.save();
    return { user };
  },

  async getPublicVA(vaId) {
    const va = await VAProfile.findById(vaId).populate('user', 'firstName lastName avatarUrl createdAt');
    if (!va) throw ApiError.notFound('VA not found');
    return { va };
  }
};