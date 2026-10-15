import { ApiError } from '../utils/ApiError.js';

export function requireRole(...roles) {
  return function check(req, _res, next) {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) return next(ApiError.forbidden('Insufficient role'));
    next();
  };
}

export const requireClient = requireRole('client');
export const requireVA = requireRole('va');
export const requireAdmin = requireRole('admin');
export const requireClientOrAdmin = requireRole('client', 'admin');
export const requireVAOrAdmin = requireRole('va', 'admin');