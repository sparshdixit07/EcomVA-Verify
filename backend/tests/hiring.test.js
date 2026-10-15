import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { VAProfile } from '../src/models/VAProfile.js';
import { User } from '../src/models/User.js';
import { Skill } from '../src/models/Skill.js';
import { SKILLS } from '../src/data/skills.seed.js';

let app;
let clientCookie;
let vaCookie;
let vaProfileId;

beforeAll(async () => {
  await connectDB(process.env.MONGODB_URI);
  app = createApp();

  const skills = await Skill.insertMany(SKILLS.slice(0, 3));

  await request(app).post('/api/auth/register').send({
    firstName: 'Hire',
    lastName: 'Client',
    email: 'hire.client@example.com',
    password: 'Password123',
    role: 'client',
    companyName: 'Hire Co'
  });
  await request(app).post('/api/auth/register').send({
    firstName: 'Hire',
    lastName: 'VA',
    email: 'hire.va@example.com',
    password: 'Password123',
    role: 'va',
    headline: 'VA'
  });

  const clientLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'hire.client@example.com', password: 'Password123' });
  clientCookie = clientLogin.headers['set-cookie'];

  const vaLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'hire.va@example.com', password: 'Password123' });
  vaCookie = vaLogin.headers['set-cookie'];

  const vaUser = await User.findOne({ email: 'hire.va@example.com' });
  const profile = await VAProfile.findOne({ user: vaUser._id });
  profile.skills.push({
    skill: skills[0]._id,
    name: skills[0].name,
    platform: 'amazon',
    yearsExperience: 3,
    level: 'advanced',
    score: 85
  });
  await profile.save();
  vaProfileId = profile._id;
});

afterAll(async () => {
  await disconnectDB();
});

describe('Hiring flow', () => {
  let hiringId;

  test('client creates a hiring request', async () => {
    const res = await request(app)
      .post('/api/hiring')
      .set('Cookie', clientCookie)
      .send({
        vaId: String(vaProfileId),
        message: 'We would like to hire you.',
        proposedRate: 8,
        hoursPerWeek: 40
      });
    expect(res.status).toBe(201);
    expect(res.body.hiring.status).toBe('pending');
    hiringId = res.body.hiring._id;
  });

  test('cannot create duplicate hiring request', async () => {
    const res = await request(app)
      .post('/api/hiring')
      .set('Cookie', clientCookie)
      .send({ vaId: String(vaProfileId), message: 'Again' });
    expect(res.status).toBe(409);
  });

  test('VA accepts hiring request and engagement is created', async () => {
    const res = await request(app)
      .post(`/api/hiring/${hiringId}/accept`)
      .set('Cookie', vaCookie);
    expect(res.status).toBe(200);
    expect(res.body.engagement._id).toBeDefined();
    expect(res.body.engagement.status).toBe('active');
  });

  test('client cannot accept their own request', async () => {
    const res = await request(app)
      .post(`/api/hiring/${hiringId}/accept`)
      .set('Cookie', clientCookie);
    expect(res.status).toBe(403);
  });

  test('invalid transition returns 400', async () => {
    const res = await request(app)
      .post(`/api/hiring/${hiringId}/reject`)
      .set('Cookie', vaCookie)
      .send({ reason: 'Nope' });
    expect([400, 403]).toContain(res.status);
  });
});