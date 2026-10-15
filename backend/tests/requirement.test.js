import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { Skill } from '../src/models/Skill.js';
import { SKILLS } from '../src/data/skills.seed.js';

let app;
let cookie;
let skillId;

beforeAll(async () => {
  await connectDB(process.env.MONGODB_URI);
  app = createApp();

  const inserted = await Skill.insertMany(SKILLS.slice(0, 3));
  skillId = inserted[0]._id;

  await request(app).post('/api/auth/register').send({
    firstName: 'Req',
    lastName: 'Client',
    email: 'req.client@example.com',
    password: 'Password123',
    role: 'client',
    companyName: 'Req Co'
  });
  const login = await request(app)
    .post('/api/auth/login')
    .send({ email: 'req.client@example.com', password: 'Password123' });
  cookie = login.headers['set-cookie'];
});

afterAll(async () => {
  await disconnectDB();
});

describe('Requirements', () => {
  let createdId;

  test('creates a requirement', async () => {
    const res = await request(app)
      .post('/api/requirements')
      .set('Cookie', cookie)
      .send({
        title: 'Test requirement',
        description: 'We need help with Amazon listings for our catalog.',
        platform: 'amazon',
        requiredSkills: [String(skillId)],
        englishLevel: 'professional',
        availability: 'full_time',
        budgetMin: 5,
        budgetMax: 10,
        hoursPerWeek: 40
      });
    expect(res.status).toBe(201);
    expect(res.body.requirement._id).toBeDefined();
    createdId = res.body.requirement._id;
  });

  test('lists my requirements', async () => {
    const res = await request(app).get('/api/requirements/mine').set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeGreaterThan(0);
  });

  test('rejects requirement with invalid skill', async () => {
    const res = await request(app)
      .post('/api/requirements')
      .set('Cookie', cookie)
      .send({
        title: 'Bad',
        description: 'Bad skill id test desc',
        platform: 'amazon',
        requiredSkills: ['0123456789abcdef01234567']
      });
    expect(res.status).toBe(400);
  });

  test('updates requirement', async () => {
    const res = await request(app)
      .put(`/api/requirements/${createdId}`)
      .set('Cookie', cookie)
      .send({ title: 'Updated title' });
    expect(res.status).toBe(200);
    expect(res.body.requirement.title).toBe('Updated title');
  });

  test('VA cannot create a requirement', async () => {
    await request(app).post('/api/auth/register').send({
      firstName: 'Req',
      lastName: 'VA',
      email: 'req.va@example.com',
      password: 'Password123',
      role: 'va',
      headline: 'VA'
    });
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'req.va@example.com', password: 'Password123' });
    const res = await request(app)
      .post('/api/requirements')
      .set('Cookie', login.headers['set-cookie'])
      .send({
        title: 'VA trying',
        description: 'Some long description here',
        platform: 'amazon',
        requiredSkills: [String(skillId)]
      });
    expect(res.status).toBe(403);
  });

  test('deletes requirement', async () => {
    const res = await request(app)
      .delete(`/api/requirements/${createdId}`)
      .set('Cookie', cookie);
    expect(res.status).toBe(200);
  });
});