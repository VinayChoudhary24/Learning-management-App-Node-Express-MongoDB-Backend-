# Learning Management System - Backend API

A robust, scalable Node.js backend API for a Learning Management System built with Express.js, TypeScript, and MongoDB. This RESTful API handles authentication, course management, payments, and notifications.

## 🚀 Features

- **User Authentication & Authorization**
  - Email/Password authentication with JWT
  - Google OAuth 2.0 integration
  - Password reset with email verification
  - Secure session management
  - Token refresh mechanism

- **Course Management**
  - Create, read, update, delete (CRUD) operations
  - Module-based course structure
  - Video content management
  - Course categorization
  - Search and filtering

- **Payment Processing**
  - Stripe integration for secure payments
  - Course purchase transactions
  - Payment history tracking
  - Webhook handling for payment events

- **Email & SMS Services**
  - Twilio/SendGrid for emails
  - Fast2sms for SMS
  - Nodemailer for email fallback
  - Welcome emails
  - Purchase confirmations
  - Password reset emails
  - Course enrollment notifications

- **Logging & Monitoring**
  - Winston logger with multiple transports
  - MongoDB logging for persistence
  - Error tracking and debugging
  - Request/response logging

- **Security & Performance**
  - Helmet.js for security headers
  - CORS configuration
  - Data compression
  - Rate limiting ready
  - Input validation

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript 5.8.3
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB 6.17.0 with Mongoose 8.16.1
- **Authentication**: JSON Web Tokens (JWT)
- **Payment**: Stripe 19.1.0
- **Email**: SendGrid & Nodemailer
- **Logging**: Winston 3.17.0

## 📦 Dependencies Explained

### Core Framework & Runtime

#### **express** (^5.1.0)

Fast, unopinionated web framework for Node.js. Handles routing, middleware, HTTP requests/responses, and forms the foundation of the API server.

#### **tsx** (^4.20.3)

TypeScript Execute - runs TypeScript files directly without pre-compilation. Used for development and running seed scripts.

#### **typescript** (^5.8.3)

Adds static type checking to JavaScript, providing better code quality, IntelliSense, and early error detection.

### Database & ODM

#### **mongodb** (^6.17.0)

Official MongoDB driver for Node.js. Provides low-level database operations and connection management.

#### **mongoose** (^8.16.1)

Elegant MongoDB object modeling (ODM) library. Provides:

- Schema definitions with validation
- Model creation and querying
- Middleware (hooks)
- Relationship management
- Type safety with TypeScript

### Authentication & Security

#### **jsonwebtoken** (^9.0.2)

Implements JSON Web Tokens (JWT) for stateless authentication. Used to:

- Generate access tokens after login
- Verify tokens on protected routes
- Create password reset tokens
- Handle token expiration

#### **bcryptjs** (^3.0.2)

Hashing library for passwords. Uses bcrypt algorithm to:

- Hash passwords before storing in database
- Compare plain text passwords with hashed versions
- Provide salt rounds for security

#### **google-auth-library** (^10.3.0)

Official Google authentication library. Enables:

- Google OAuth 2.0 login
- Verify Google ID tokens
- Authenticate users via Google accounts

#### **helmet** (^8.1.0)

Secures Express apps by setting various HTTP headers:

- Content Security Policy
- X-Frame-Options (clickjacking protection)
- X-Content-Type-Options
- Strict-Transport-Security
- And 11 other security headers

#### **cors** (^2.8.5)

Cross-Origin Resource Sharing middleware. Configures which domains can access the API and what methods/headers are allowed.

#### **cookie-parser** (^1.4.7)

Parses cookies attached to client requests. Used for:

- Reading JWT tokens from HTTP-only cookies
- Managing refresh tokens
- Session handling

#### **validator** (^13.15.15)

String validation and sanitization library. Validates:

- Email addresses
- URLs
- Credit cards
- Phone numbers
- Custom validation rules

### Payment Processing

#### **stripe** (^19.1.0)

Official Stripe SDK for payment processing. Handles:

- Payment intent creation
- Webhook signature verification

### Email Services

#### **@sendgrid/mail** (^8.1.6)

SendGrid's official Node.js library. Primary email service for:

- Transactional emails
- Email templates
- High deliverability
- Analytics and tracking

#### **nodemailer** (^7.0.4)

Email sending library with multiple transport options. Used as:

- Fallback email service
- Development email testing
- SMTP server integration
- Custom email templates

### Utilities & Helpers

#### **dotenv** (^17.0.0)

Loads environment variables from `.env` file into `process.env`. Essential for configuration management and keeping secrets out of code.

#### **dayjs** (^1.11.13)

Lightweight date manipulation library (2KB alternative to Moment.js). Used for:

- Date formatting
- Date calculations
- Timezone handling
- Relative time display

#### **axios** (^1.10.0)

Promise-based HTTP client. Used for:

- Making API calls to third-party services
- Google OAuth verification
- External service integration

#### **compression** (^1.8.0)

Middleware for response compression (gzip/deflate). Reduces response size by ~70% for text-based responses, improving API performance.

### Logging & Monitoring

#### **winston** (^3.17.0)

Versatile logging library with multiple transports. Features:

- Multiple log levels (error, warn, info, debug)
- Custom log formats
- File and console logging
- JSON and text formats
- Production-ready logging

#### **winston-mongodb** (^7.0.0)

MongoDB transport for Winston. Stores logs in database for:

- Long-term log persistence
- Query and analysis of logs
- Error tracking over time
- Audit trails

## 🔧 Development Dependencies

### TypeScript Support

#### **@types/\*** packages

TypeScript type definitions for JavaScript libraries:

- `@types/express` - Express.js types
- `@types/node` - Node.js types
- `@types/jsonwebtoken` - JWT types
- `@types/cors` - CORS types
- `@types/compression` - Compression types
- `@types/cookie-parser` - Cookie parser types
- `@types/nodemailer` - Nodemailer types
- `@types/validator` - Validator types

#### **ts-node** (^10.9.2)

TypeScript execution engine for Node.js. Allows running `.ts` files directly during development.

### Code Quality & Linting

#### **eslint** (^9.30.1)

JavaScript and TypeScript linter. Enforces code style and catches bugs.

#### **@typescript-eslint/eslint-plugin** (^8.35.1)

ESLint plugin with TypeScript-specific linting rules.

#### **@typescript-eslint/parser** (^8.35.1)

Parser that allows ESLint to understand TypeScript syntax.

#### **prettier** (^3.6.2)

Opinionated code formatter. Automatically formats code for consistency.

#### **eslint-config-prettier** (^10.1.5)

Disables ESLint rules that conflict with Prettier.

#### **eslint-plugin-prettier** (^5.5.1)

Runs Prettier as an ESLint rule.

### Git Hooks & Automation

#### **husky** (^9.1.7)

Git hooks manager. Runs scripts before commits/pushes:

- Pre-commit: Lint and format staged files
- Pre-push: Run tests
- Commit-msg: Validate commit messages

#### **lint-staged** (^16.1.2)

Runs linters on staged git files only. Ensures only quality code is committed.

### Development Tools

#### **nodemon** (^3.1.10)

Monitors file changes and automatically restarts the server during development. Improves developer experience significantly.

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm** or **yarn**: Latest version
- **MongoDB**: v6.0 or higher (local or MongoDB Atlas)
- **Stripe Account**: For payment processing
- **SendGrid Account**: For email services
- **Google Cloud Console**: For OAuth (optional)

## 🔧 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd learning-platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
MONGODB_URI=mongodb://localhost:27017/learning-platform
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/learning-platform

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_token_secret_key
JWT_REFRESH_EXPIRE=30d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key

# SendGrid
SENDGRID_API_KEY=SG.your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=Learning Platform

# Nodemailer (Fallback/Development)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password

# Frontend URL
CLIENT_URL=http://localhost:5173

# File Upload (if applicable)
MAX_FILE_UPLOAD=5000000
FILE_UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Set up MongoDB

**Option A: Local MongoDB**

```bash
# Install MongoDB locally
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Add to `.env` as `MONGODB_URI`

### 5. Seed the database (optional)

```bash
npm run seed
```

To destroy all data:

```bash
npm run seed:destroy
```

## 📜 Available Scripts

### Development

```bash
npm run dev
```

Starts development server with hot reload using nodemon.

### Development (with type checking)

```bash
npm run start:dev
```

Runs TypeScript compiler check then starts server with tsx.

### Production

```bash
npm start
```

Starts production server from compiled JavaScript in `dist/` folder.

### Build

```bash
npm run build
```

Compiles TypeScript to JavaScript in `dist/` folder.

### Linting

```bash
npm run lint
```

Runs ESLint and auto-fixes issues.

### Formatting

```bash
npm run format
```

Formats all files with Prettier.

### Database Seeding

```bash
npm run seed
```

Seeds database with sample data for development.

```bash
npm run seed:destroy
```

Removes all data from database (use with caution!).

## 🔐 Authentication Flow

### Registration

1. User submits email and password
2. Password is hashed with bcrypt (10 salt rounds)
3. User document created in MongoDB
4. Welcome email sent via SendGrid
5. JWT token generated and returned

### Login

1. User submits credentials
2. Password compared with hashed version
3. JWT access token generated (7 days)
4. Refresh token generated (30 days)
5. Tokens returned to client

### Google OAuth

1. Frontend receives Google ID token
2. Backend verifies token with Google Auth Library
3. User created/found in database
4. JWT tokens generated
5. User logged in

### Password Reset

1. User requests password reset
2. Reset token generated and hashed
3. Email sent with reset link
4. User clicks link and submits new password
5. Password updated in database

## 💳 Payment Integration

### Stripe Checkout Flow

1. User selects course to purchase
2. Backend creates Stripe Checkout Session
3. User redirected to Stripe payment page
4. Payment processed by Stripe
5. Webhook event sent to backend
6. Course enrollment created
7. Confirmation email sent

### Webhook Handling

```typescript
// Stripe webhooks for:
-payment_intent.succeeded -
  payment_intent.failed -
  checkout.session.completed -
  customer.subscription.updated;
```

## 📧 Email Service Architecture

### Primary: SendGrid

- Transactional emails
- Email templates
- High deliverability
- Analytics

### Fallback: Nodemailer

- Development environment
- SMTP fallback
- Custom templates

## 📊 Logging Strategy

### Winston Transports

1. **Console**: Development logging with colors
2. **File**: Error and combined logs
3. **MongoDB**: Production logging for analysis

### Log Levels

- `error`: Errors and exceptions
- `warn`: Warning messages
- `info`: General information
- `http`: HTTP requests
- `debug`: Debug information

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Environment Setup

1. Set `NODE_ENV=production`
2. Use production MongoDB URI
3. Use production Stripe keys
4. Configure CORS for production domain
5. Set secure JWT secrets

## 🔒 Security Best Practices

### Implemented Security Measures

✅ Helmet.js for security headers
✅ CORS configuration
✅ JWT authentication
✅ Password hashing with bcrypt
✅ Input validation and sanitization
✅ Environment variables for secrets
✅ HTTP-only cookies for tokens
✅ Mongoose injection prevention

### Additional Recommendations

- Implement rate limiting (express-rate-limit)
- Add request size limits
- Use MongoDB field encryption for sensitive data
- Implement refresh token rotation
- Add 2FA for sensitive operations
- Regular security audits
- Keep dependencies updated

## 🧪 Testing

### Recommended Testing Stack

```json
{
  "jest": "Testing framework",
  "supertest": "HTTP assertions",
  "@types/jest": "TypeScript support",
  "mongodb-memory-server": "In-memory MongoDB for tests"
}
```

### Example Test Script

```bash
npm test
npm run test:watch
npm run test:coverage
```

## 📈 Performance Optimization

### Implemented

- Response compression with gzip
- MongoDB indexing on frequently queried fields
- Connection pooling
- Async/await for non-blocking I/O

### Recommendations

- Implement Redis caching
- Add database query optimization
- Use PM2 for cluster mode
- Implement CDN for static assets
- Add database replication

## 🐛 Error Handling

### Global Error Handler

Catches all errors and sends appropriate responses:

```typescript
{
  success: false,
  error: {
    message: "Error message",
    statusCode: 400,
    stack: "..." // Only in development
  }
}
```

### Error Types

- ValidationError (400)
- AuthenticationError (401)
- AuthorizationError (403)
- NotFoundError (404)
- ServerError (500)

## 📚 API Documentation

### Base URL

```
Development: http://localhost:5000/api/v1
Production: https://api.yourdomain.com/api/v1
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Coding Standards

- Follow TypeScript best practices
- Use async/await over callbacks
- Write meaningful commit messages
- Add JSDoc comments for functions
- Keep functions small and focused
- Use meaningful variable names

## 📝 License

This project is licensed under the ISC License.

## 👥 Support

For support:

- Email: vinaychoudhary994@gmail.com

## 🙏 Acknowledgments

- Express.js team for the amazing framework
- MongoDB team for the excellent database
- Stripe for payment infrastructure
- SendGrid for email services
- Open source community

---

**Built with ❤️ using Node.js, Express, TypeScript, and MongoDB**
