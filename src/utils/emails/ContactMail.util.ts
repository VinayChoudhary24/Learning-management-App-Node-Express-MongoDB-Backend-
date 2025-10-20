import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import { appConfig } from '../../config/appConfig/app.config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactEmail = async (contactData: ContactFormData) => {
  const transporter = nodemailer.createTransport({
    service: appConfig.smtp_service,
    auth: {
      user: appConfig.defi_smtp_mail,
      pass: appConfig.defi_smtp_mail_pass,
    },
  });

  const mailOptions = {
    from: appConfig.defi_smtp_mail,
    to: appConfig.defi_smtp_mail, // Send to Myself
    replyTo: contactData.email, // Allow easy reply to the user
    subject: `Contact Form: ${contactData.subject}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  background-color: #ffffff;
                  padding: 30px;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .header {
                  text-align: center;
                  border-bottom: 3px solid #20d49a;
                  padding-bottom: 20px;
                  margin-bottom: 30px;
              }
              .logo {
                  max-width: 150px;
                  margin-bottom: 10px;
              }
              .header h1 {
                  color: #333;
                  margin: 0;
                  font-size: 24px;
              }
              .content {
                  color: #555;
                  line-height: 1.6;
              }
              .info-row {
                  margin-bottom: 20px;
                  padding: 15px;
                  background-color: #f9f9f9;
                  border-left: 4px solid #20d49a;
                  border-radius: 4px;
              }
              .info-label {
                  font-weight: bold;
                  color: #333;
                  display: block;
                  margin-bottom: 5px;
                  font-size: 14px;
                  text-transform: uppercase;
              }
              .info-value {
                  color: #555;
                  font-size: 16px;
                  word-wrap: break-word;
              }
              .message-box {
                  background-color: #f9f9f9;
                  padding: 20px;
                  border-radius: 4px;
                  margin-top: 20px;
                  border: 1px solid #e0e0e0;
              }
              .footer {
                  margin-top: 30px;
                  padding-top: 20px;
                  border-top: 1px solid #e0e0e0;
                  text-align: center;
                  color: #999;
                  font-size: 12px;
              }
              @media only screen and (max-width: 600px) {
                  .container {
                      padding: 20px;
                      margin: 10px;
                  }
                  .logo {
                      max-width: 120px;
                  }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img class="logo" src="cid:defiLogo" alt="DEFI Logo">
                  <h1>New Contact Form Submission</h1>
              </div>
              <div class="content">
                  <p>You have received a new message from your website contact form:</p>
                  
                  <div class="info-row">
                      <span class="info-label">Name</span>
                      <span class="info-value">${contactData.name}</span>
                  </div>
                  
                  <div class="info-row">
                      <span class="info-label">Email</span>
                      <span class="info-value">${contactData.email}</span>
                  </div>
                  
                  <div class="info-row">
                      <span class="info-label">Subject</span>
                      <span class="info-value">${contactData.subject}</span>
                  </div>
                  
                  <div class="info-row">
                      <span class="info-label">Message</span>
                      <div class="message-box">
                          ${contactData.message.replace(/\n/g, '<br>')}
                      </div>
                  </div>
                  
                  <p style="margin-top: 20px; padding: 15px; background-color: #e8f5e9; border-radius: 4px; color: #2e7d32;">
                      💡 <strong>Tip:</strong> You can reply directly to this email to respond to ${contactData.name}.
                  </p>
              </div>
              <div class="footer">
                  <p>Received on ${new Date().toLocaleString('en-US', {
                    dateStyle: 'full',
                    timeStyle: 'short',
                  })}</p>
                  <p>© ${new Date().getFullYear()} DEFI. All rights reserved.</p>
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
