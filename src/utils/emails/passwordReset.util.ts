import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import { appConfig } from '../../config/appConfig/app.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendPasswordResetEmail = async (user: any, resetPasswordURL: string) => {
  const transporter = nodemailer.createTransport({
    service: appConfig.smtp_service,
    auth: {
      user: appConfig.defi_smtp_mail,
      pass: appConfig.defi_smtp_mail_pass,
    },
  });

  const mailOptions = {
    from: appConfig.defi_smtp_mail,
    to: user.email,
    subject: 'Password Reset',
    html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                /* Add your custom CSS styles here */
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
                    <h1>Password Reset</h1>
                </div>
                <div class="content">
                    <p>Hello, ${user.firstName}</p>
                    <p>You have requested to reset your password for your DEFI account. To reset your password, please click the button below:</p>
                    <p><a class="button" href="${resetPasswordURL}">Reset Password</a></p>
                    <p>If you did not request a password reset, please ignore this email.</p>
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
