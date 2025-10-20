import nodemailer from 'nodemailer';
import { appConfig } from '../../config/appConfig';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendPaymentConfirmationEmail = async (details: {
  name: string;
  userEmail: string;
  amount: number;
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
    subject: 'Payment Confirmation - Your DEFI-Learning Order is Confirmed!',
    html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                /* Your existing CSS styles are reused here */
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
                    background-color: #20d49a;
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
                    <h1>Payment Successful!</h1>
                </div>
                <div class="content">
                    <p>Hello, ${details.name}</p>
                    <p>Thank you for your payment. We have successfully received your transaction and your order is being processed.</p>
                    <p><strong>Amount Paid:</strong> ${formattedAmount}</p>
                    <p>You can view your order details and manage your account by clicking the button below:</p>
                    <p><a class="button" href="YOUR_DASHBOARD_URL_HERE">View Your Account</a></p>
                    <p>If you have any questions, please don't hesitate to contact our support team.</p>
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
