// import nodemailer from 'nodemailer';
// import { appConfig } from '../../config/appConfig/app.config.js';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const sendPaymentFailedEmail = async (details: {
//   name: string;
//   userEmail: string;
//   amount: number;
//   reason?: string;
// }) => {
//   const transporter = nodemailer.createTransport({
//     service: appConfig.smtp_service,
//     auth: {
//       user: appConfig.defi_smtp_mail,
//       pass: appConfig.defi_smtp_mail_pass,
//     },
//   });

//   const formattedAmount = new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(details.amount);

//   const mailOptions = {
//     from: appConfig.defi_smtp_mail,
//     to: details.userEmail,
//     subject: 'Action Required: Your DEFI Payment Failed',
//     html: `
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <style>
//                 /* Your existing CSS styles are reused here for consistency */
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
//                     background-color: #20d49a; /* You might consider a warning color like orange/red here */
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
//                     <h1>Payment Failed</h1>
//                 </div>
//                 <div class="content">
//                     <p>Hello, ${details.name}</p>
//                     <p>We're sorry, but we were unable to process your recent payment for your DEFI account.</p>
//                     <p><strong>Attempted Amount:</strong> ${formattedAmount}</p>
//                     ${details.reason ? `<p><strong>Reason:</strong> ${details.reason}</p>` : 'Something went wrong. please try again...'}
//                     <p>Please update your payment information to keep your account active. You can update your details by clicking the button below:</p>
//                     <p><a class="button" href="YOUR_PAYMENT_SETTINGS_URL_HERE">Update Payment Method</a></p>
//                     <p>If you believe this is an error, please contact our support team immediately.</p>
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
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { promises as fs } from 'fs';
import { appConfig } from '../../config/appConfig/app.config.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Set SendGrid API Key
sgMail.setApiKey(appConfig.sendgrid_api_key);

export const sendPaymentFailedEmail = async (details: {
  name: string;
  userEmail: string;
  amount: number;
  reason?: string;
}) => {
  try {
    // Read the logo file and convert to base64
    // const logoPath = path.join(__dirname, 'logos/letter-d.png');
    // const logoBuffer = await fs.readFile(logoPath);
    // const logoBase64 = logoBuffer.toString('base64');

    const formattedAmount = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(details.amount);

    const mailOptions = {
      from: appConfig.defi_smtp_mail, // Must be a verified sender in SendGrid
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
                    <img class="logo" src="http://cdn.mcauto-images-production.sendgrid.net/c026287495e59764/fb9d2c7c-8c48-4c22-8990-f7a933747d8e/512x512.png" alt="DEFI Logo">
                    <h1>Payment Failed</h1>
                </div>
                <div class="content">
                    <p>Hello, ${details.name}</p>
                    <p>We're sorry, but we were unable to process your recent payment for your DEFI account.</p>
                    <p><strong>Attempted Amount:</strong> ${formattedAmount}</p>
                    ${details.reason ? `<p><strong>Reason:</strong> ${details.reason}</p>` : '<p>Something went wrong. please try again...</p>'}
                    <p>Please update your payment information to keep your account active. You can update your details by clicking the button below:</p>
                    <p><a class="button" href="YOUR_PAYMENT_SETTINGS_URL_HERE">Update Payment Method</a></p>
                    <p>If you believe this is an error, please contact our support team immediately.</p>
                </div>
            </div>
        </body>
        </html>
      `,
      // attachments: [
      //   {
      //     filename: 'letter-d.png',
      //     content: logoBase64,
      //     type: 'image/png',
      //     disposition: 'inline',
      //     content_id: 'defiLogo',
      //   },
      // ],
    };

    await sgMail.send(mailOptions);
  } catch (err) {
    console.error('MAILER ERROR:', err);
    // throw new ErrorHandler(500, err?.message || 'Failed to send payment failed email');
  }
};
