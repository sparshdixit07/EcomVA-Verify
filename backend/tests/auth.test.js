import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { ClientProfile } from '../src/models/ClientProfile.js';
import { VAProfile } from '../src/models/VAProfile.js';

let app;

beforeAll(async () => {
  await connectDB(process.env.MONGODB_URI);
  app = createApp();
});

afterAll(async () => {
  await disconnectDB();
});

describe('Authentication', () => {
  test('registers a client', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Test',
        lastName: 'Client',
        email: 'test.client@example.com',
        password: 'Password123',
        role: 'client',
        companyName: 'Test Co'
      });
    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('test.client@example.com');
    expect(res.body.user.passwordHash).toBeUndefined();

    const user = await User.findOne({ email: 'test.client@example.com' });
    expect(user).toBeTruthy();
    const profile = await ClientProfile.findOne({ user: user._id });
    expect(profile).toBeTruthy();
  });

  test('rejects registration with weak password', async () => {
    const res = await request(app).post('/api/auth/register').send({
      firstName: 'Bad',
      lastName: 'Pass',
      email: 'bad.pass@example.com',
      password: 'short',
      role: 'client',
      companyName: 'X'
    });
    expect(res.status).toBe(400);
  });

  test('registers a VA', async () => {
    const res = await request(app).post('/api/auth/register').send({
      firstName: 'Test',
      lastName: 'VA',
      email: 'test.va@example.com',
      password: 'Password123',
      role: 'va',
      headline: 'Amazon listing specialist'
    });
    expect(res.status).toBe(201);
    const user = await User.findOne({ email: 'test.va@example.com' });
    const profile = await VAProfile.findOne({ user: user._id });
    expect(profile).toBeTruthy();
    expect(profile.headline).toBe('Amazon listing specialist');
  });

  test('does not allow admin self-registration', async () => {
    const res = await request(app).post('/api/auth/register').send({
      firstName: 'Evil',
      lastName: 'Admin',
      email: 'evil.admin@example.com',
      password: 'Password123',
      role: 'admin'
    });
    expect(res.status).toBe(400);
  });

  test('logs in and sets HTTP-only cookie', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test.client@example.com',
      password: 'Password123'
    });
    expect(res.status).toBe(200);
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies.some((c) => c.includes('HttpOnly'))).toBe(true);
  });

  test('rejects invalid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test.client@example.com',
      password: 'WrongPass123'
    });
    expect(res.status).toBe(401);
  });

  test('GET /me returns current user when authenticated', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test.client@example.com', password: 'Password123' });
    const cookies = login.headers['set-cookie'];
    const res = await request(app).get('/api/auth/me').set('Cookie', cookies);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('test.client@example.com');
  });

  test('GET /me is 401 without cookie', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('logout clears cookie', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test.client@example.com', password: 'Password123' });
    const cookies = login.headers['set-cookie'];
    const res = await request(app).post('/api/auth/logout').set('Cookie', cookies);
    expect(res.status).toBe(200);
    const cleared = res.headers['set-cookie'];
    expect(cleared[0]).toMatch(/ev_token=;/);
  });
});