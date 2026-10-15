import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { nanoid } from 'nanoid';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const SAFE_NAME_RE = /[^a-z0-9._-]+/gi;
const BLOCKED_EXT = new Set([
  '.exe', '.sh', '.bat', '.cmd', '.com', '.msi', '.ps1', '.php',
  '.py', '.rb', '.pl', '.jar', '.scr', '.vbs', '.js', '.html', '.htm'
]);

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    const dir = path.resolve(env.upload.dir);
    ensureDir(dir);
    cb(null, dir);
  },
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname || '').toLowerCase();
    if (BLOCKED_EXT.has(ext)) return cb(new ApiError(400, 'File type not allowed'));
    const base = path
      .basename(file.originalname || 'file', ext)
      .replace(SAFE_NAME_RE, '_')
      .slice(0, 40);
    const safe = `${Date.now()}_${nanoid(8)}_${base || 'file'}${ext}`;
    cb(null, safe);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: env.upload.maxBytes, files: 5 },
  fileFilter(_req, file, cb) {
    const ext = path.extname(file.originalname || '').toLowerCase();
    if (BLOCKED_EXT.has(ext)) return cb(new ApiError(400, 'File type not allowed'));
    if (env.upload.allowedMime.length && !env.upload.allowedMime.includes(file.mimetype)) {
      return cb(new ApiError(400, `MIME not allowed: ${file.mimetype}`));
    }
    cb(null, true);
  }
});

export function fileUrlFor(file) {
  return `/uploads/${file.filename}`;
}