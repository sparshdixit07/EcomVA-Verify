import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';

let app;

beforeAll(async () => {
  await connectDB(process.env.MONGODB_URI);
  app = createApp();

  await request(app).post('/api/auth/register').send({
    firstName: 'Sec',
    lastName: 'User',
    email: 'sec.user@example.com',
    password: 'Password123',
    role: 'client',
    companyName: 'Sec Co'
  });
});

afterAll(async () => {
  await disconnectDB();
});

describe('Security', () => {
  test('passwords are hashed, never returned', async () => {
    const user = await User.findOne({ email: 'sec.user@example.com' }).select('+passwordHash');
    expect(user.passwordHash).toBeTruthy();
    expect(user.passwordHash).not.toBe('Password123');
    expect(user.passwordHash.startsWith('$2') || user.passwordHash.startsWith('$argon2')).toBe(true);
  });

  test('NoSQL injection attempt is sanitized', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: { $gt: '' }, password: 'x' });
    expect(res.status).toBe(400);
  });

  test('missing fields are rejected by zod', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
  });

  test('errors do not leak stack in production env', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.message).toBeDefined();
    expect(res.body.stack).toBeUndefined();
  });

  test('JWT forged token rejected', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', 'ev_token=not.a.valid.token');
    expect(res.status).toBe(401);
  });

  test('oversized payload rejected', async () => {
    const big = 'a'.repeat(2 * 1024 * 1024);
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'x@example.com', password: big });
    expect([400, 413]).toContain(res.status);
  });
});