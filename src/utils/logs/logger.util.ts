import winston, { createLogger, format, transports } from 'winston';
import 'winston-mongodb';
import { appConfig } from '../../config/appConfig';
// import dotenv from "dotenv";

// Load environment variables from .env
// dotenv.config();

const { combine, timestamp, printf, colorize, errors, json, prettyPrint } = format;

// Custom colors for log levels
const customColors = {
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  debug: 'green',
  verbose: 'magenta',
};

// Add custom colors to winston
winston.addColors(customColors);

// Define custom format for console
const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack, ...meta }) => {
    const metaString =
      Object.keys(meta).length > 0 ? `\n📋 Meta: ${JSON.stringify(meta, null, 2)}` : '';

    return `${timestamp} | ${level}: ${message}${stack ? `\nStack: ${stack}` : ''}${metaString}`;
  }),
);

// Pretty format for file logging
const fileFormat = combine(timestamp(), errors({ stack: true }), json(), prettyPrint());

// MongoDB URI from env
const mongoURI = appConfig.mongoURI as string;

// // Logger for info logs (requests)
// export const requestLogger = createLogger({
//   level: "info",
//   format: combine(
//     timestamp(),
//     errors({ stack: true }),
//     printf(({ timestamp, message, ...meta }) => {
//       const metaString =
//         Object.keys(meta).length > 0 ? ` | Meta: ${JSON.stringify(meta)}` : "";

//       return `${timestamp} | ${message}${metaString}`;
//     })
//   ),
//   transports: [
//     new transports.MongoDB({
//       level: "info",
//       db: mongoURI,
//       options: { useUnifiedTopology: true },
//       collection: "RequestLogs",
//       tryReconnect: true,
//     }),
//   ],
// });

// Logger for error logs
export const errorLogger = createLogger({
  level: 'error',
  format: combine(
    timestamp(),
    errors({ stack: true }),
    printf(({ timestamp, message, stack, merchantUserId, ...meta }) => {
      const metaString = Object.keys(meta).length > 0 ? ` | Meta: ${JSON.stringify(meta)}` : '';

      return `${timestamp} | ${merchantUserId} | ${message}${
        stack ? `\nStack: ${stack}` : ''
      }${metaString}`;
    }),
  ),
  transports: [
    new transports.MongoDB({
      level: 'error',
      db: mongoURI,
      collection: 'ErrorLogs',
      tryReconnect: true,
      // options: {
      //   useUnifiedTopology: true,
      //   tls: true,
      //   // ssl: true, // force TLS
      //   // tlsAllowInvalidCertificates: false, // stricter (true if testing locally)
      // },
    }),
  ],
});

// Console logger for development
export const consoleLogger = createLogger({
  level: 'debug',
  format: consoleFormat,
  transports: [
    new transports.Console({
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
});

export const jobsLogger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    errors({ stack: true }),
    printf(({ timestamp, level, message, stack, ...meta }) => {
      // meta may contain jobName, status, runAtUnix, etc.
      const metaString = Object.keys(meta).length > 0 ? ` | Meta: ${JSON.stringify(meta)}` : '';
      return `${timestamp} | ${level.toUpperCase()} | ${message}${stack ? `\nStack: ${stack}` : ''}${metaString}`;
    }),
  ),
  transports: [
    new transports.MongoDB({
      level: 'info',
      db: mongoURI,
      collection: 'ScheduledJobsLogs',
      tryReconnect: true,
      // options: {
      //   useUnifiedTopology: true,
      //   tls: true,
      //   // ssl: true, // force TLS
      //   // tlsAllowInvalidCertificates: false, // stricter (true if testing locally)
      // },
    }),
    // new transports.Console({
    //   handleExceptions: true,
    //   handleRejections: true,
    // }),
  ],
});
