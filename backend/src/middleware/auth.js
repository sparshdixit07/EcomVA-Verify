import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { verifyToken } from '../utils/jwt.js';

function extractToken(req) {
  if (req.cookies?.[env.cookie.name]) return req.cookies[env.cookie.name];
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) return header.slice(7);
  return null;
}

export async function requireAuth(req, _res, next) {
  try {
    const token = extractToken(req);
    if (!token) return next(ApiError.unauthorized('Authentication required'));

    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      return next(ApiError.unauthorized('Invalid or expired token'));
    }

    const user = await User.findById(payload.sub).select('+passwordHash');
    if (!user) return next(ApiError.unauthorized('User no longer exists'));
    if (user.status === 'suspended') return next(ApiError.forbidden('Account suspended'));
    if (user.status === 'deactivated') return next(ApiError.forbidden('Account deactivated'));

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

export async function optionalAuth(req, _res, next) {
  try {
    const token = extractToken(req);
    if (!token) return next();
    try {
      const payload = verifyToken(token);
      const user = await User.findById(payload.sub);
      if (user && user.status === 'active') req.user = user;
    } catch {
      /* ignore */
    }
    next();
  } catch (err) {
    next(err);
  }
}