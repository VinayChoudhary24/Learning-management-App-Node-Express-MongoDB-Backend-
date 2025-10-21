import express, { Application } from 'express';
// import session from 'express-session';
import AuthRoutes from './features/auth/routes/auth.routes.js';
import UserRoutes from './features/user/routes/user.routes.js';
import CourseRoutes from './features/course/routes/course.routes.js';
import CategoryRoutes from './features/category/routes/category.routes.js';
import EnrollmentRoutes from './features/enrollment/routes/enrollment.routes.js';
import PaymentRoutes from './features/payment/routes/payment.routes.js';
import PaymentWebhooksRoutes from './features/payment/routes/webhook.routes.js';
// import CourseModulesRoutes from './features/courseModules/routes/module.routes';

import { applyParsingMiddleware } from './middleware/expressAppMiddleware/parser.middleware.js';
import { applySecurityMiddleware } from './middleware/expressAppMiddleware/security.middleware.js';
import { errorHandlerMiddleware } from './middleware/error/errorHandler.middleware.js';
import { notFoundMiddleware } from './middleware/error/notFound.middleware.js';

import healthCheckRouter from './config/health/health.js';

// import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
// import { ExpressAdapter } from '@bull-board/express';
// import { createBullBoard } from '@bull-board/api';
// import { cronQueue } from './config/redis/redisCronQueue/cron.queue';

const app: Application = express();

// ------------------ Middleware Stack ------------------ //
applySecurityMiddleware(app);

// STRIPE WEBHOOK ROUTES NEEDS RAW BODY, NO NEED TO PARSE
app.use('/api/webhooks', PaymentWebhooksRoutes); // Webhooks (raw body)
// STRIPE WEBHOOK ROUTES NEEDS RAW BODY, NO NEED TO PARSE

applyParsingMiddleware(app);

// ------------------ Health Check ------------------ //
app.use('/api/health', healthCheckRouter);

// ------------------ Redis-Bull Board ------------------ //
// const serverAdapter = new ExpressAdapter();
// serverAdapter.setBasePath('/admin/queues');
// createBullBoard({
//   queues: [new BullMQAdapter(cronQueue)],
//   serverAdapter,
// });
// app.use('/admin/queues', serverAdapter.getRouter());

// ------------------ Mount Routes ------------------ //
app.use('/api/auth', AuthRoutes); // goes to authRoute
app.use('/api/user', UserRoutes); // goes to userRoute
app.use('/api/course', CourseRoutes); // goes to courseRoute
app.use('/api/category', CategoryRoutes); // goes to categoryRoute
app.use('/api/enrollment', EnrollmentRoutes); // goes to enrollmentRoute
app.use('/api/payment', PaymentRoutes); // goes to paymentRoute
// app.use('/api/module', CourseModulesRoutes); // goes to moduleRoutes

// ------------------ 404 Handler ------------------ //
app.use(notFoundMiddleware);

// ------------------ Error Handler ------------------ //
app.use(errorHandlerMiddleware);

export default app;
