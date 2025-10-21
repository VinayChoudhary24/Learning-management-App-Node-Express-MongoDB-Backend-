// import nodemailer from 'nodemailer';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { appConfig } from '../../config/appConfig/app.config.js';
// import { ErrorHandler } from '../errors/errorHandler.util.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const sendOtpEmail = async (email: any, otp: string) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: appConfig.smtp_service,
//       port: 587,
//       secure: false,
//       auth: {
//         user: appConfig.defi_smtp_mail,
//         pass: appConfig.defi_smtp_mail_pass,
//       },
//       tls: {
//         rejectUnauthorized: false,
//       },
//     });

//     const mailOptions = {
//       from: process.env.LMS_MAIL,
//       to: email,
//       subject: 'Your DEFI Account OTP Verification Code',
//       html: `
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <style>
//               body {
//                   font-family: Arial, sans-serif;
//                   background-color: #f9f9f9;
//                   margin: 0;
//                   padding: 0;
//               }
//               .container {
//                   max-width: 600px;
//                   margin: 20px auto;
//                   background: #ffffff;
//                   border-radius: 8px;
//                   padding: 20px;
//                   box-shadow: 0 2px 6px rgba(0,0,0,0.1);
//               }
//               .header {
//                   text-align: center;
//                   padding-bottom: 20px;
//                   border-bottom: 1px solid #eee;
//               }
//               .logo {
//                   max-width: 150px;
//                   margin-bottom: 10px;
//               }
//               h1 {
//                   font-size: 20px;
//                   color: #333333;
//               }
//               .content {
//                   margin-top: 20px;
//                   text-align: center;
//               }
//               .otp-box {
//                   display: inline-block;
//                   font-size: 24px;
//                   letter-spacing: 8px;
//                   padding: 15px 30px;
//                   background: #20d49a;
//                   color: #ffffff;
//                   font-weight: bold;
//                   border-radius: 6px;
//                   margin: 20px 0;
//               }
//               p {
//                   font-size: 16px;
//                   color: #555555;
//                   margin: 10px 0;
//               }
//               .footer {
//                   text-align: center;
//                   font-size: 12px;
//                   color: #999999;
//                   margin-top: 30px;
//               }
//               @media only screen and (max-width: 600px) {
//                   .container {
//                       padding: 15px;
//                   }
//                   .otp-box {
//                       font-size: 20px;
//                       padding: 12px 20px;
//                       letter-spacing: 5px;
//                   }
//               }
//           </style>
//       </head>
//       <body>
//           <div class="container">
//               <div class="header">
//                   <img class="logo" src="cid:defiLogo" alt="DEFI Logo">
//                   <h1>Email Verification</h1>
//               </div>
//               <div class="content">
//                   <p>Hello,</p>
//                   <p>Please use the OTP below to verify your email address:</p>
//                   <div class="otp-box">${otp}</div>
//                   <p>This OTP is valid for <strong>1 minute</strong>. Do not share it with anyone.</p>
//               </div>
//               <div class="footer">
//                   <p>If you did not request this, you can ignore this email.</p>
//                   <p>© ${new Date().getFullYear()} DEFI. All rights reserved.</p>
//               </div>
//           </div>
//       </body>
//       </html>
//     `,
//       attachments: [
//         {
//           filename: 'letter-d.png',
//           path: path.join(__dirname, 'logos/letter-d.png'),
//           cid: 'defiLogo',
//         },
//       ],
//     };

//     await transporter.sendMail(mailOptions);
//   } catch (err: any) {
//     console.error('MAILER ERROR:', err);
//     throw new ErrorHandler(500, err?.message || 'Failed to send OTP email');
//   }
// };
import sgMail from '@sendgrid/mail';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import { appConfig } from '../../config/appConfig/app.config.js';
import { ErrorHandler } from '../errors/errorHandler.util.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set SendGrid API Key
sgMail.setApiKey(appConfig.sendgrid_api_key);

export const sendOtpEmail = async (email: any, otp: string) => {
  try {
    // Read the logo file and convert to base64
    const logoPath = path.join(__dirname, 'logos/letter-d.png');
    const logoBuffer = await fs.readFile(logoPath);
    const logoBase64 = logoBuffer.toString('base64');

    const mailOptions = {
      from: appConfig.defi_smtp_mail, // Must be a verified sender in SendGrid
      to: email,
      subject: 'Your DEFI Account OTP Verification Code',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f9f9f9;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                }
                .header {
                    text-align: center;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #eee;
                }
                .logo {
                    max-width: 150px;
                    margin-bottom: 10px;
                }
                h1 {
                    font-size: 20px;
                    color: #333333;
                }
                .content {
                    margin-top: 20px;
                    text-align: center;
                }
                .otp-box {
                    display: inline-block;
                    font-size: 24px;
                    letter-spacing: 8px;
                    padding: 15px 30px;
                    background: #20d49a;
                    color: #ffffff;
                    font-weight: bold;
                    border-radius: 6px;
                    margin: 20px 0;
                }
                p {
                    font-size: 16px;
                    color: #555555;
                    margin: 10px 0;
                }
                .footer {
                    text-align: center;
                    font-size: 12px;
                    color: #999999;
                    margin-top: 30px;
                }
                @media only screen and (max-width: 600px) {
                    .container {
                        padding: 15px;
                    }
                    .otp-box {
                        font-size: 20px;
                        padding: 12px 20px;
                        letter-spacing: 5px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img class="logo" src="cid:defiLogo" alt="DEFI Logo">
                    <h1>Email Verification</h1>
                </div>
                <div class="content">
                    <p>Hello,</p>
                    <p>Please use the OTP below to verify your email address:</p>
                    <div class="otp-box">${otp}</div>
                    <p>This OTP is valid for <strong>1 minute</strong>. Do not share it with anyone.</p>
                </div>
                <div class="footer">
                    <p>If you did not request this, you can ignore this email.</p>
                    <p>© ${new Date().getFullYear()} DEFI. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: 'letter-d.png',
          content: logoBase64,
          type: 'image/png',
          disposition: 'inline',
          content_id: 'defiLogo',
        },
      ],
    };

    await sgMail.send(mailOptions);
  } catch (err: any) {
    console.error('MAILER ERROR:', err);
    throw new ErrorHandler(500, err?.message || 'Failed to send OTP email');
  }
};
