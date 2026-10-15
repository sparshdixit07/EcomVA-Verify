import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

mongoose.set('strictQuery', true);

export async function connectDB(uri = env.mongoUri) {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  try {
    await mongoose.connect(uri, {
      autoIndex: !env.isProd,
      serverSelectionTimeoutMS: 10000
    });
    logger.info(`MongoDB connected: ${mongoose.connection.name}`);
    return mongoose.connection;
  } catch (err) {
    logger.error(`MongoDB connection error: ${err.message}`);
    throw err;
  }
}

export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected');
  }
}

export { mongoose };