import argon2 from 'argon2';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';

export async function hashPassword(plain) {
  if (env.password.driver === 'bcrypt') {
    return bcrypt.hash(plain, env.password.bcryptRounds);
  }
  return argon2.hash(plain, {
    type: argon2.argon2id,
    memoryCost: env.password.argon2.memoryCost,
    timeCost: env.password.argon2.timeCost,
    parallelism: env.password.argon2.parallelism
  });
}

export async function verifyPassword(plain, hash) {
  if (!hash) return false;
  if (hash.startsWith('$argon2')) {
    try {
      return await argon2.verify(hash, plain);
    } catch {
      return false;
    }
  }
  if (hash.startsWith('$2')) {
    return bcrypt.compare(plain, hash);
  }
  return false;
}