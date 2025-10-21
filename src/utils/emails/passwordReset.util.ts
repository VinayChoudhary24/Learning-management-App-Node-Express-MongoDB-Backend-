// import nodemailer from 'nodemailer';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { appConfig } from '../../config/appConfig/app.config.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const sendPasswordResetEmail = async (user: any, resetPasswordURL: string) => {
//   const transporter = nodemailer.createTransport({
//     service: appConfig.smtp_service,
//     auth: {
//       user: appConfig.defi_smtp_mail,
//       pass: appConfig.defi_smtp_mail_pass,
//     },
//   });

//   const mailOptions = {
//     from: appConfig.defi_smtp_mail,
//     to: user.email,
//     subject: 'Password Reset',
//     html: `
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <style>
//                 /* Add your custom CSS styles here */
//                 body {
//                     font-family: Arial, sans-serif;
//                 }
//                 .container {
//                     max-width: 600px;
//                     margin: 0 auto;
//                     padding: 20px;
//                 }
//                 .header {
//                     text-align: center;
//                 }
//                 .logo {
//                     max-width: 150px;
//                 }
//                 .content {
//                     margin-top: 20px;
//                 }
//                 .button {
//                     display: inline-block;
//                     padding: 10px 20px;
//                     background-color: #20d49a;
//                     color: #ffffff;
//                     text-decoration: none;
//                     border-radius: 5px;
//                 }
//                 /* Mobile Responsive Styles */
//                 @media only screen and (max-width: 600px) {
//                     .container {
//                         padding: 10px;
//                     }
//                     .logo {
//                         max-width: 100px;
//                     }
//                     .button {
//                         display: block;
//                         margin-top: 10px;
//                     }
//                 }
//             </style>
//         </head>
//         <body>
//             <div class="container">
//                 <div class="header">
//                     <img class="logo" src="cid:defiLogo" alt="DEFI Logo">
//                     <h1>Password Reset</h1>
//                 </div>
//                 <div class="content">
//                     <p>Hello, ${user.firstName}</p>
//                     <p>You have requested to reset your password for your DEFI account. To reset your password, please click the button below:</p>
//                     <p><a class="button" href="${resetPasswordURL}">Reset Password</a></p>
//                     <p>If you did not request a password reset, please ignore this email.</p>
//                 </div>
//             </div>
//         </body>
//         </html>
//     `,
//     attachments: [
//       {
//         filename: 'letter-d.png',
//         path: path.join(__dirname, 'logos/letter-d.png'),
//         cid: 'defiLogo',
//       },
//     ],
//   };

//   await transporter.sendMail(mailOptions);
// };
import sgMail from '@sendgrid/mail';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import { appConfig } from '../../config/appConfig/app.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// // Set SendGrid API Key
sgMail.setApiKey(appConfig.sendgrid_api_key);
// // sgMail.setDataResidency('eu'); // Uncomment if using EU regional subuser

export const sendPasswordResetEmail = async (user: any, resetPasswordURL: string) => {
  try {
    // Read the logo file and convert to base64
    const logoPath = path.join(__dirname, 'logos/letter-d.png');
    const logoBuffer = await fs.readFile(logoPath);
    const logoBase64 = logoBuffer.toString('base64');

    const mailOptions = {
      from: appConfig.defi_smtp_mail, // Must be a verified sender in SendGrid
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
          content: logoBase64,
          type: 'image/png',
          disposition: 'inline',
          content_id: 'defiLogo',
        },
      ],
    };

    await sgMail.send(mailOptions);
  } catch (err) {
    console.error('MAILER ERROR:', err);
    // throw new ErrorHandler(500, err?.message || 'Failed to send OTP email');
  }
};
