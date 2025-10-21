import { createServer } from 'http';
import app from './app.js';
import { appConfig } from './config/appConfig/app.config.js';
import { consoleLogger } from './utils/logs/logger.util.js';
import { connectDB } from './config/db/db.js';
// import { connectRedis } from './config/redis/redisClient.js';
// import { checkAndRecoverJobs } from './config/redis/redisCronRecovery/cron.recovery.js';
// import { scheduleCronJobs } from './config/redis/redisScheduler/cron.scheduler.js';
// import { startCronWorker, stopCronWorker } from './config/redis/redisWorker/cron.worker.js';

const server = createServer(app);

// const port = appConfig.port as number;
// const host = appConfig.host as string;
const port: number = 8004;
// Always bind to 0.0.0.0 (Render requires this)
const host: string = '0.0.0.0';

const startServer = async () => {
  try {
    await connectDB();

    // await connectRedis(); // Initialize Redis

    // Check for failed and missed jobs
    // await checkAndRecoverJobs();

    // Run schedule repeatable jobs
    // await scheduleCronJobs();

    // Start cron worker manually
    // startCronWorker();

    server.listen(port, host, () => {
      consoleLogger.debug({
        service: appConfig.name,
        status: `running at http://${host}:${port}`,
        MongoDB: `Connected to DB`,
      });
    });
  } catch (err) {
    consoleLogger.error({ learningServer: `failed to start server: ${err}` });
    // await stopCronWorker();
  }
};

startServer();

// Gracefully handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  // console.error(red.bold("UNCAUGHT EXCEPTION 🔥"), err);
  shutdownGracefully();
});

// Gracefully handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  // console.error(red.bold("UNHANDLED REJECTION ⚠️"), reason);
  shutdownGracefully();
});

// Graceful shutdown function
function shutdownGracefully() {
  // console.log(red("Shutting down merchant service gracefully..."));
  server.close(() => {
    // console.log(red("Server closed."));
    process.exit(1); // Exit with failure
  });

  // Force exit if shutdown takes too long
  setTimeout(() => {
    // console.error(red("Force exiting..."));
    process.exit(1);
  }, 10000); // 10 seconds
}
