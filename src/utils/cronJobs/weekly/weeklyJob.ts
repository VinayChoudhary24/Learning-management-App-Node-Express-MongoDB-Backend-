import { jobsLogger } from '../../logs/logger.util';
import dayjs from 'dayjs';

export const weeklyJobHandler = async (context?: { jobId?: string; runAtUnix?: number }) => {
  const runAtUnix = context?.runAtUnix ?? dayjs().unix();

  try {
    console.log('Running LMS weekly job...');
    // ... weekly job logic goes here ...

    // Log success
    jobsLogger.info('LMS Weekly job executed successfully', {
      jobName: 'weeklyJob',
      status: 'completed',
      runAtUnix,
    });
  } catch (err: any) {
    // Log failure
    jobsLogger.error('LMS Weekly job failed', {
      jobName: 'weeklyJob',
      status: 'failed',
      runAtUnix,
      errorMessage: err.message,
      stack: err.stack,
    });
    throw err; // rethrow so BullMQ marks the job as failed
  }
};
