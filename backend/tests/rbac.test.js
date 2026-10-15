import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';

let app;
let clientCookie;
let vaCookie;

beforeAll(async () => {
  await connectDB(process.env.MONGODB_URI);
  app = createApp();

  await request(app).post('/api/auth/register').send({
    firstName: 'RBAC',
    lastName: 'Client',
    email: 'rbac.client@example.com',
    password: 'Password123',
    role: 'client',
    companyName: 'RBAC Co'
  });
  await request(app).post('/api/auth/register').send({
    firstName: 'RBAC',
    lastName: 'VA',
    email: 'rbac.va@example.com',
    password: 'Password123',
    role: 'va',
    headline: 'VA'
  });

  const c = await request(app)
    .post('/api/auth/login')
    .send({ email: 'rbac.client@example.com', password: 'Password123' });
  clientCookie = c.headers['set-cookie'];

  const v = await request(app)
    .post('/api/auth/login')
    .send({ email: 'rbac.va@example.com', password: 'Password123' });
  vaCookie = v.headers['set-cookie'];
});

afterAll(async () => {
  await disconnectDB();
});

describe('RBAC', () => {
  test('VA cannot access client dashboard', async () => {
    const res = await request(app).get('/api/clients/me/dashboard').set('Cookie', vaCookie);
    expect(res.status).toBe(403);
  });

  test('Client cannot access VA profile endpoint', async () => {
    const res = await request(app).get('/api/vas/me').set('Cookie', clientCookie);
    expect(res.status).toBe(403);
  });

  test('Non-admin cannot list users via admin endpoint', async () => {
    const res = await request(app).get('/api/admin/users').set('Cookie', clientCookie);
    expect(res.status).toBe(403);
  });

  test('Anonymous cannot hit admin endpoints', async () => {
    const res = await request(app).get('/api/admin/users');
    expect(res.status).toBe(401);
  });

  test('Client can access own dashboard', async () => {
    const res = await request(app).get('/api/clients/me/dashboard').set('Cookie', clientCookie);
    expect(res.status).toBe(200);
    expect(res.body.stats).toBeDefined();
  });

  test('VA can access own dashboard', async () => {
    const res = await request(app).get('/api/vas/me/dashboard').set('Cookie', vaCookie);
    expect(res.status).toBe(200);
    expect(res.body.stats).toBeDefined();
  });
});