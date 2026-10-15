import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { matchingService, MATCH_WEIGHTS } from '../src/services/matching.service.js';

beforeAll(async () => {
  await connectDB(process.env.MONGODB_URI);
});

afterAll(async () => {
  await disconnectDB();
});

describe('Matching engine', () => {
  test('weights sum to 1.0', () => {
    const total = Object.values(MATCH_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(Math.round(total * 100) / 100).toBe(1);
  });

  test('perfect candidate scores high', () => {
    const requirement = {
      platform: 'amazon',
      requiredSkills: ['s1', 's2'],
      englishLevel: 'fluent',
      availability: 'full_time',
      timezone: 'Asia/Manila',
      budgetMin: 5,
      budgetMax: 10,
      yearsExperience: 3
    };
    const va = {
      skills: [
        { skill: 's1', platform: 'amazon' },
        { skill: 's2', platform: 'amazon' }
      ],
      englishLevel: 'fluent',
      availability: 'full_time',
      timezone: 'Asia/Manila',
      hourlyRate: 8,
      yearsExperience: 5,
      assessmentAverage: 90,
      practicalAverage: 90,
      verificationStatus: 'verified'
    };
    const { score, factors, reasons } = matchingService.score(requirement, va);
    expect(score).toBeGreaterThanOrEqual(90);
    expect(factors.platform).toBe(100);
    expect(factors.skills).toBe(100);
    expect(reasons.length).toBeGreaterThan(0);
  });

  test('poor candidate scores low', () => {
    const requirement = {
      platform: 'shopify',
      requiredSkills: ['s1', 's2', 's3'],
      englishLevel: 'native',
      availability: 'full_time',
      timezone: 'Asia/Manila',
      budgetMin: 5,
      budgetMax: 8,
      yearsExperience: 5
    };
    const va = {
      skills: [],
      englishLevel: 'basic',
      availability: 'part_time',
      timezone: 'America/New_York',
      hourlyRate: 40,
      yearsExperience: 0,
      assessmentAverage: 30,
      practicalAverage: 30,
      verificationStatus: 'unverified'
    };
    const { score } = matchingService.score(requirement, va);
    expect(score).toBeLessThan(50);
  });

  test('partial skill match reflects proportionally', () => {
    const requirement = {
      platform: 'amazon',
      requiredSkills: ['s1', 's2', 's3', 's4'],
      englishLevel: 'professional',
      availability: 'full_time',
      timezone: '',
      budgetMin: null,
      budgetMax: null,
      yearsExperience: 0
    };
    const va = {
      skills: [{ skill: 's1', platform: 'amazon' }, { skill: 's2', platform: 'amazon' }],
      englishLevel: 'professional',
      availability: 'full_time',
      timezone: '',
      hourlyRate: null,
      yearsExperience: 2,
      assessmentAverage: 60,
      practicalAverage: 60,
      verificationStatus: 'unverified'
    };
    const { factors } = matchingService.score(requirement, va);
    expect(factors.skills).toBe(50);
  });
});