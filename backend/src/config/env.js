import dotenv from 'dotenv';
dotenv.config();

function required(key, fallback) {
  const v = process.env[key];
  if (v === undefined || v === '') {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required env variable: ${key}`);
  }
  return v;
}

function bool(key, fallback = false) {
  const v = process.env[key];
  if (v === undefined) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(v).toLowerCase());
}

function num(key, fallback) {
  const v = process.env[key];
  if (v === undefined || v === '') return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: (process.env.NODE_ENV || 'development') === 'production',
  isTest: process.env.NODE_ENV === 'test',

  port: num('PORT', 5000),
  backendUrl: process.env.BACKEND_URL || 'http://localhost:5000',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),

  mongoUri: required('MONGODB_URI', 'mongodb://127.0.0.1:27017/ecomva_verify'),

  jwtSecret: required('JWT_SECRET', 'dev_only_change_me_please_change_me_please'),
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  cookie: {
    name: process.env.COOKIE_NAME || 'ev_token',
    secure: bool('COOKIE_SECURE', false),
    sameSite: process.env.COOKIE_SAME_SITE || 'lax',
    domain: process.env.COOKIE_DOMAIN || undefined,
    maxAgeMs: 7 * 24 * 60 * 60 * 1000
  },

  password: {
    driver: (process.env.PASSWORD_HASH_DRIVER || 'argon2').toLowerCase(),
    argon2: {
      memoryCost: num('ARGON2_MEMORY_COST', 19456),
      timeCost: num('ARGON2_TIME_COST', 2),
      parallelism: num('ARGON2_PARALLELISM', 1)
    },
    bcryptRounds: num('BCRYPT_ROUNDS', 12)
  },

  upload: {
    dir: process.env.UPLOAD_DIR || './uploads',
    maxBytes: num('UPLOAD_MAX_BYTES', 5 * 1024 * 1024),
    allowedMime: (process.env.UPLOAD_ALLOWED_MIME ||
      'image/png,image/jpeg,image/webp,application/pdf')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  },

  rateLimit: {
    windowMs: num('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000),
    max: num('RATE_LIMIT_MAX', 300),
    authMax: num('AUTH_RATE_LIMIT_MAX', 20)
  },

  mail: {
    enabled: bool('MAIL_ENABLED', false),
    host: process.env.MAIL_HOST || '',
    port: num('MAIL_PORT', 587),
    user: process.env.MAIL_USER || '',
    pass: process.env.MAIL_PASS || '',
    from: process.env.MAIL_FROM || 'no-reply@ecomva-verify.local'
  },

  ai: {
    enabled: bool('AI_ENABLED', false),
    provider: process.env.AI_PROVIDER || '',
    apiKey: process.env.AI_API_KEY || ''
  }
};