import nodemailer from 'nodemailer';
import { appConfig } from '../../config/appConfig/app.config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendPaymentFailedEmail = async (details: {
  name: string;
  userEmail: string;
  amount: number;
  reason?: string;
}) => {
  const transporter = nodemailer.createTransport({
    service: appConfig.smtp_service,
    auth: {
      user: appConfig.defi_smtp_mail,
      pass: appConfig.defi_smtp_mail_pass,
    },
  });

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(details.amount);

  const mailOptions = {
    from: appConfig.defi_smtp_mail,
    to: details.userEmail,
    subject: 'Action Required: Your DEFI Payment Failed',
    html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                /* Your existing CSS styles are reused here for consistency */
                body {
                    font-family: Arial, sans-serif;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    text-align: center;
                }
                .logo {
                    max-width: 150px;
                }
                .content {
                    margin-top: 20px;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #20d49a; /* You might consider a warning color like orange/red here */
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                }
                /* Mobile Responsive Styles */
                @media only screen and (max-width: 600px) {
                    .container {
                        padding: 10px;
                    }
                    .logo {
                        max-width: 100px;
                    }
                    .button {
                        display: block;
                        margin-top: 10px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img class="logo" src="cid:defiLogo" alt="DEFI Logo">
                    <h1>Payment Failed</h1>
                </div>
                <div class="content">
                    <p>Hello, ${details.name}</p>
                    <p>We're sorry, but we were unable to process your recent payment for your DEFI account.</p>
                    <p><strong>Attempted Amount:</strong> ${formattedAmount}</p>
                    ${details.reason ? `<p><strong>Reason:</strong> ${details.reason}</p>` : 'Something went wrong. please try again...'}
                    <p>Please update your payment information to keep your account active. You can update your details by clicking the button below:</p>
                    <p><a class="button" href="YOUR_PAYMENT_SETTINGS_URL_HERE">Update Payment Method</a></p>
                    <p>If you believe this is an error, please contact our support team immediately.</p>
                </div>
            </div>
        </body>
        </html>
    `,
    attachments: [
      {
        filename: 'letter-d.png',
        path: path.join(__dirname, 'logos/letter-d.png'),
        cid: 'defiLogo',
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};
