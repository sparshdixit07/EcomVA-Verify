import { MongoMemoryServer } from 'mongodb-memory-server';
import { jest } from '@jest/globals';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key_at_least_32_characters_long';
process.env.COOKIE_SECURE = 'false';
process.env.COOKIE_SAME_SITE = 'lax';
process.env.PASSWORD_HASH_DRIVER = 'bcrypt';
process.env.BCRYPT_ROUNDS = '4';
process.env.MAIL_ENABLED = 'false';

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
});

afterAll(async () => {
  if (mongod) await mongod.stop();
});

jest.setTimeout(30000);