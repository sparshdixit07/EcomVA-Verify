import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { logger } from './config/logger.js';

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught exception: ${err.stack || err.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled rejection: ${reason instanceof Error ? reason.stack : reason}`);
  process.exit(1);
});

async function main() {
  try {
    await connectDB();
  } catch (err) {
    logger.error(`Startup failed: MongoDB connection — ${err.message}`);
    process.exit(1);
  }

  const app = createApp();

  const server = app.listen(env.port);
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      logger.error(
        `Port ${env.port} is already in use. Kill the existing process with: ` +
        `netstat -ano | findstr :${env.port}  then  taskkill /PID <pid> /F`
      );
    } else {
      logger.error(`HTTP server error: ${err.message}`);
    }
    process.exit(1);
  });

  server.on('listening', () => {
    logger.info(`EcomVA Verify API listening on ${env.backendUrl} (port ${env.port})`);
    logger.info(`Allowed CORS origins: ${env.corsOrigins.join(', ')}`);
  });

  const shutdown = async (signal) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      try {
        await disconnectDB();
      } finally {
        process.exit(0);
      }
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main();