import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAccessToken(payload) {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtAccessExpiresIn,
    issuer: 'ecomva-verify'
  });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtRefreshExpiresIn,
    issuer: 'ecomva-verify'
  });
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret, { issuer: 'ecomva-verify' });
}