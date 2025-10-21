import { jobsLogger } from '../../logs/logger.util.js';
import dayjs from 'dayjs';

export const monthlyJobHandler = async (context?: { jobId?: string; runAtUnix?: number }) => {
  const runAtUnix = context?.runAtUnix ?? dayjs().unix();

  try {
    console.log('Running LMS monthly job...');
    // ... monthly job logic goes here ...

    // Log success
    jobsLogger.info('LMS Monthly job executed successfully', {
      jobName: 'monthlyJob',
      status: 'completed',
      runAtUnix,
    });
  } catch (err: any) {
    // Log failure
    jobsLogger.error('LMS Monthly job failed', {
      jobName: 'monthlyJob',
      status: 'failed',
      runAtUnix,
      errorMessage: err.message,
      stack: err.stack,
    });
    throw err; // rethrow so BullMQ marks the job as failed
  }
};
