import crypto from 'crypto';
import { User } from '../models/User.js';
import { ClientProfile } from '../models/ClientProfile.js';
import { VAProfile } from '../models/VAProfile.js';
import { ApiError } from '../utils/ApiError.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { signAccessToken } from '../utils/jwt.js';
import { env } from '../config/env.js';
import { sendMail } from '../utils/mailer.js';
import { logger } from '../config/logger.js';

function publicUser(user) {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    status: user.status,
    avatarUrl: user.avatarUrl,
    phone: user.phone,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt
  };
}

function setAuthCookie(res, token) {
  res.cookie(env.cookie.name, token, {
    httpOnly: true,
    secure: env.cookie.secure,
    sameSite: env.cookie.sameSite,
    domain: env.cookie.domain,
    maxAge: env.cookie.maxAgeMs,
    path: '/'
  });
}

export const authService = {
  async register(payload) {
    const existing = await User.findOne({ email: payload.email });
    if (existing) throw ApiError.conflict('Email already registered');

    const passwordHash = await hashPassword(payload.password);
    const user = await User.create({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      passwordHash,
      role: payload.role,
      status: 'active'
    });

    if (payload.role === 'client') {
      await ClientProfile.create({
        user: user._id,
        companyName: payload.companyName || ''
      });
    } else if (payload.role === 'va') {
      await VAProfile.create({
        user: user._id,
        headline: payload.headline || '',
        country: payload.country || ''
      });
    }

    return { user: publicUser(user) };
  },

  async login({ email, password }) {
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) throw ApiError.unauthorized('Invalid credentials');
    if (user.status === 'suspended') throw ApiError.forbidden('Account suspended');
    if (user.status === 'deactivated') throw ApiError.forbidden('Account deactivated');

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) throw ApiError.unauthorized('Invalid credentials');

    user.lastLoginAt = new Date();
    await user.save();

    const token = signAccessToken({ sub: user._id.toString(), role: user.role });
    return { user: publicUser(user), token };
  },

  issueCookie(res, token) {
    setAuthCookie(res, token);
  },

  clearCookie(res) {
    res.clearCookie(env.cookie.name, {
      httpOnly: true,
      secure: env.cookie.secure,
      sameSite: env.cookie.sameSite,
      domain: env.cookie.domain,
      path: '/'
    });
  },

  async me(userId) {
    const user = await User.findById(userId);
    if (!user) throw ApiError.unauthorized();
    return { user: publicUser(user) };
  },

  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) return { sent: false };
    const token = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();
    const link = `${env.frontendUrl}/reset-password?token=${token}`;
    await sendMail({
      to: user.email,
      subject: 'Reset your EcomVA Verify password',
      text: `Reset your password: ${link}`,
      html: `<p>Reset your password: <a href="${link}">${link}</a></p>`
    });
    logger.info(`Password reset token issued for ${user.email}`);
    return { sent: true };
  },

  async resetPassword({ token, password }) {
    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashed,
      passwordResetExpires: { $gt: new Date() }
    }).select('+passwordResetToken +passwordResetExpires');
    if (!user) throw ApiError.badRequest('Invalid or expired reset token');
    user.passwordHash = await hashPassword(password);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();
    return { ok: true };
  },

  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await User.findById(userId).select('+passwordHash');
    if (!user) throw ApiError.unauthorized();
    const ok = await verifyPassword(currentPassword, user.passwordHash);
    if (!ok) throw ApiError.badRequest('Current password is incorrect');
    user.passwordHash = await hashPassword(newPassword);
    await user.save();
    return { ok: true };
  }
};