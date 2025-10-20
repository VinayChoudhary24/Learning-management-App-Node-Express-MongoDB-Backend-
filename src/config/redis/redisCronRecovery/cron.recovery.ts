// import dayjs from 'dayjs';
// import { cronQueue } from '../redisCronQueue/cron.queue';
// import mongoose from 'mongoose';
// import { jobsLogger } from '../../../utils/logs/logger.util';

// // Minimal schema, store metadata as raw object
// const ScheduledJobLogSchema = new mongoose.Schema(
//   {
//     level: String,
//     message: String,
//     metadata: mongoose.Schema.Types.Mixed, // metadata stored here
//     timestamp: Number,
//   },
//   { collection: 'ScheduledJobsLogs' },
// );

// const ScheduledJobLog = mongoose.model('ScheduledJobLog', ScheduledJobLogSchema);

// /**
//  * Retry failed jobs and recover missed daily, weekly, and monthly jobs.
//  */
// export const checkAndRecoverJobs = async () => {
//   try {
//     // -----------------------------
//     // Retry all failed jobs
//     // -----------------------------
//     const failedJobs: any[] = await ScheduledJobLog.find({ 'metadata.status': 'failed' }).lean();
//     for (const job of failedJobs) {
//       const jobName = job.metadata?.jobName;
//       const runAtUnix = job.metadata?.runAtUnix;
//       if (!jobName || !runAtUnix) continue;

//       jobsLogger.info('Re-running failed job', { jobName, runAtUnix });
//       await cronQueue.add(jobName, { recovered: true, originalRunAtUnix: runAtUnix });
//     }

//     const now = dayjs();

//     // -----------------------------
//     // Recover daily job
//     // -----------------------------
//     const lastDaily: any = await ScheduledJobLog.findOne({
//       'metadata.jobName': 'dailyJob',
//       'metadata.status': 'completed',
//     })
//       .sort({ 'metadata.runAtUnix': -1 })
//       .lean();

//     const dailyScheduledUnix = now.startOf('day').add(15, 'minute').unix(); // daily at 00:15
//     const currentUnix = now.unix();

//     // Only recover if:
//     // 1. The scheduled time has already passed today
//     // 2. AND there's no completion record for today's run
//     if (currentUnix > dailyScheduledUnix) {
//       const todayStart = now.startOf('day').unix();

//       if (!lastDaily || lastDaily.metadata?.runAtUnix < todayStart) {
//         jobsLogger.warn('Detected missed daily run. Enqueuing recovery job.', {
//           jobName: 'dailyJob',
//           lastRunAtUnix: lastDaily?.metadata?.runAtUnix,
//           scheduledUnix: dailyScheduledUnix,
//         });
//         await cronQueue.add('dailyJob', { recovered: true, missed: true });
//       } else {
//         jobsLogger.info('Daily job already executed today. No recovery needed.', {
//           jobName: 'dailyJob',
//           lastRunAtUnix: lastDaily?.metadata?.runAtUnix,
//         });
//       }
//     } else {
//       jobsLogger.info('Daily job scheduled time has not arrived yet. Skipping recovery check.', {
//         jobName: 'dailyJob',
//         scheduledUnix: dailyScheduledUnix,
//         currentUnix,
//       });
//     }

//     // -----------------------------
//     // Recover weekly job
//     // -----------------------------
//     const lastWeekly: any = await ScheduledJobLog.findOne({
//       'metadata.jobName': 'weeklyJob',
//       'metadata.status': 'completed',
//     })
//       .sort({ 'metadata.runAtUnix': -1 })
//       .lean();

//     const weeklyScheduledUnix = now.startOf('week').add(1, 'hour').unix(); // Monday 01:00

//     // Only check on Monday and only if the scheduled time has passed
//     if (now.day() === 1 && currentUnix > weeklyScheduledUnix) {
//       const weekStart = now.startOf('week').unix();

//       if (!lastWeekly || lastWeekly.metadata?.runAtUnix < weekStart) {
//         jobsLogger.warn('Detected missed weekly run. Enqueuing recovery job.', {
//           jobName: 'weeklyJob',
//           lastRunAtUnix: lastWeekly?.metadata?.runAtUnix,
//           scheduledUnix: weeklyScheduledUnix,
//         });
//         await cronQueue.add('weeklyJob', { recovered: true, missed: true });
//       } else {
//         jobsLogger.info('Weekly job already executed this week. No recovery needed.', {
//           jobName: 'weeklyJob',
//           lastRunAtUnix: lastWeekly?.metadata?.runAtUnix,
//         });
//       }
//     } else {
//       jobsLogger.info('Weekly job: Either not Monday or scheduled time has not arrived yet.', {
//         jobName: 'weeklyJob',
//         currentDay: now.day(),
//         scheduledUnix: weeklyScheduledUnix,
//         currentUnix,
//       });
//     }

//     // -----------------------------
//     // Recover monthly job
//     // -----------------------------
//     const lastMonthly: any = await ScheduledJobLog.findOne({
//       'metadata.jobName': 'monthlyJob',
//       'metadata.status': 'completed',
//     })
//       .sort({ 'metadata.runAtUnix': -1 })
//       .lean();

//     const monthlyScheduledUnix = now.startOf('month').add(2, 'hour').unix(); // 1st day 02:00

//     // Only check on the 1st and only if the scheduled time has passed
//     if (now.date() === 1 && currentUnix > monthlyScheduledUnix) {
//       const monthStart = now.startOf('month').unix();

//       if (!lastMonthly || lastMonthly.metadata?.runAtUnix < monthStart) {
//         jobsLogger.warn('Detected missed monthly run. Enqueuing recovery job.', {
//           jobName: 'monthlyJob',
//           lastRunAtUnix: lastMonthly?.metadata?.runAtUnix,
//           scheduledUnix: monthlyScheduledUnix,
//         });
//         await cronQueue.add('monthlyJob', { recovered: true, missed: true });
//       } else {
//         jobsLogger.info('Monthly job already executed this month. No recovery needed.', {
//           jobName: 'monthlyJob',
//           lastRunAtUnix: lastMonthly?.metadata?.runAtUnix,
//         });
//       }
//     } else {
//       jobsLogger.info(
//         'Monthly job: Either not 1st of month or scheduled time has not arrived yet.',
//         {
//           jobName: 'monthlyJob',
//           currentDate: now.date(),
//           scheduledUnix: monthlyScheduledUnix,
//           currentUnix,
//         },
//       );
//     }

//     jobsLogger.info('Job recovery check completed successfully');
//   } catch (err: any) {
//     jobsLogger.error('Job recovery process failed', { error: err.message, stack: err.stack });
//   }
// };
