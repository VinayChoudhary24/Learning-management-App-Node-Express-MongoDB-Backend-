// Load the environment variables
import dotenv from 'dotenv';
// Load environment variables from .env
dotenv.config();

const name = process.env.NAME || 'leraning-server';
const port = process.env.PORT || 8004;
const host = process.env.HOST || 'localhost';
const mongoURI = process.env.mongoURI;
const jwt_secret =
  process.env.JWT_Secret ||
  'mK&nWKX*Zy8=PePf2AC8jA5Y9HYf2xgJU!@kLac8mdVru!V3GJAK9tMa!8e!NPHwpWzzr6y^Pzqv&R$37kuVh^Sc@JudrwW&-QT@=GSvfwQEArRfN&%hm+-5RHsx2^csar!%UwWBNygXezrWn8CbY4XNvX9!D6e6_W&CeBWF@==TPT_MsP#AsQb!KqE8tkbNFVVS!f_M_@mM4CRB3w+*ebnu&Rzf7z!bttCD=V7uMQ5$T6EJrPUV&HQW?SP5HRH$';
const cookieExpiresIN = process.env.COOKIE_EXPIRES_IN || 2;

// EMAIL CREDS
const smtp_service = process.env.SMPT_SERVICE || 'fix SMTP Service';
const defi_smtp_mail = process.env.DEFI_SMPT_MAIL || 'fix DEFI SMTP Mail';
const defi_smtp_mail_pass = process.env.DEFI_SMPT_MAIL_PASSWORD || 'fix DEFI SMTP mail password';

const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';

// GOOGLE CRED
const googleClientId = process.env.GOOGLE_CLIENT_ID || 'fix-google-client-id';
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || 'fix-google-client-secret';
const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI || 'fix-redirect-uri';

// SMS CRED
const fast2SmsApiKey = process.env.FAST2SMS_API_KEY || 'fix fast2SMS api key';
const fast2SmsUrl = process.env.FAST2SMS_URL || 'fix fast2SMS url';

// STRIPE CRED
const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || 'fix stripe publishable key';
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'fix stripe secret key';

const appConfig = {
  name: name,
  port: port,
  host: host,
  mongoURI: mongoURI,
  jwt_secret: jwt_secret,
  cookieExpiresIN: cookieExpiresIN,
  smtp_service: smtp_service,
  defi_smtp_mail: defi_smtp_mail,
  defi_smtp_mail_pass: defi_smtp_mail_pass,
  frontendURL: frontendURL,
  googleClientId,
  googleClientSecret,
  googleRedirectUri,
  fast2SmsApiKey,
  fast2SmsUrl,
  stripePublishableKey,
  stripeSecretKey,
};

export { appConfig };
