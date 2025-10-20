import nodemailer from 'nodemailer';
import { appConfig } from '../../config/appConfig/app.config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendWelcomeEmail = async (user: any) => {
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
    subject: 'Welcome to DEFI! 🎉',
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
                  padding: 0;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                  overflow: hidden;
              }
              .header {
                  text-align: center;
                  background: linear-gradient(135deg, #20d49a 0%, #18a87b 100%);
                  padding: 40px 30px;
                  color: #ffffff;
              }
              .logo {
                  max-width: 150px;
                  margin-bottom: 20px;
                  filter: brightness(0) invert(1);
              }
              .header h1 {
                  margin: 0;
                  font-size: 28px;
                  font-weight: 700;
              }
              .content {
                  padding: 40px 30px;
                  color: #555;
                  line-height: 1.6;
              }
              .greeting {
                  font-size: 20px;
                  font-weight: 600;
                  color: #333;
                  margin-bottom: 20px;
              }
              .content p {
                  margin-bottom: 15px;
                  font-size: 16px;
              }
              .feature-box {
                  background-color: #f9f9f9;
                  padding: 20px;
                  border-left: 4px solid #20d49a;
                  border-radius: 4px;
                  margin: 25px 0;
              }
              .feature-box h3 {
                  margin: 0 0 10px 0;
                  color: #333;
                  font-size: 18px;
              }
              .feature-box p {
                  margin: 0;
                  color: #666;
                  font-size: 14px;
              }
              .cta-button {
                  display: inline-block;
                  padding: 14px 32px;
                  background-color: #20d49a;
                  color: #ffffff !important;
                  text-decoration: none;
                  border-radius: 6px;
                  font-weight: 600;
                  margin: 20px 0;
                  transition: background-color 0.3s ease;
              }
              .cta-button:hover {
                  background-color: #18a87b;
              }
              .divider {
                  height: 1px;
                  background: linear-gradient(to right, transparent, #e0e0e0, transparent);
                  margin: 30px 0;
              }
              .footer {
                  background-color: #f9f9f9;
                  padding: 30px;
                  text-align: center;
                  border-top: 1px solid #e0e0e0;
              }
              .footer p {
                  margin: 8px 0;
                  color: #999;
                  font-size: 13px;
              }
              .social-links {
                  margin-top: 20px;
              }
              .social-links a {
                  display: inline-block;
                  margin: 0 8px;
                  color: #20d49a;
                  text-decoration: none;
                  font-size: 14px;
              }
              .highlight {
                  color: #20d49a;
                  font-weight: 600;
              }
              @media only screen and (max-width: 600px) {
                  .container {
                      margin: 10px;
                      border-radius: 4px;
                  }
                  .header {
                      padding: 30px 20px;
                  }
                  .logo {
                      max-width: 120px;
                  }
                  .header h1 {
                      font-size: 24px;
                  }
                  .content {
                      padding: 30px 20px;
                  }
                  .greeting {
                      font-size: 18px;
                  }
                  .cta-button {
                      display: block;
                      text-align: center;
                  }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img class="logo" src="cid:defiLogo" alt="DEFI Logo">
                  <h1>Welcome to DEFI! 🎉</h1>
              </div>
              
              <div class="content">
                  <p class="greeting">Hello, ${user.firstName ? user.firstName : 'User'} 👋</p>
                  
                  <p>We're absolutely <span class="highlight">thrilled</span> to have you join our learning community! Your account has been created successfully, and you're all set to begin your educational journey.</p>
                  
                  <div class="feature-box">
                      <h3>🚀 What's Next?</h3>
                      <p>Explore our vast library of courses, connect with expert instructors, and start learning at your own pace. Your future starts now!</p>
                  </div>
                  
                  <p>Here's what you can do right away:</p>
                  <ul style="color: #555; line-height: 1.8;">
                      <li>Browse our <strong>extensive course catalog</strong></li>
                      <li>Complete your <strong>profile</strong> to personalize your experience</li>
                      <li>Join <strong>community discussions</strong> and connect with fellow learners</li>
                      <li>Track your <strong>learning progress</strong> and achievements</li>
                  </ul>
                  
                  <center>
                      <a href="appConfig.frontend_url" || 'https://defi.com'}" class="cta-button">
                          Start Learning Now →
                      </a>
                  </center>
                  
                  <div class="divider"></div>
                  
                  <p style="font-size: 14px; color: #666;">
                      💡 <strong>Pro Tip:</strong> Enable notifications to stay updated on new courses, special offers, and learning reminders!
                  </p>
                  
                  <p style="margin-top: 25px;">
                      If you have any questions or need assistance, our support team is here to help. Feel free to reach out anytime!
                  </p>
                  
                  <p style="margin-top: 25px; font-weight: 600; color: #333;">
                      Happy learning! 📚✨
                  </p>
              </div>
              
              <div class="footer">
                  <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
                      <strong>Need Help?</strong> Contact us at <a href="mailto:${appConfig.defi_smtp_mail}" style="color: #20d49a; text-decoration: none;">${appConfig.defi_smtp_mail}</a>
                  </p>
                  
                  <div class="divider" style="margin: 20px 0;"></div>
                  
                  <p style="font-size: 12px; color: #999;">
                      If you did not create this account, please ignore this email or contact our support team.
                  </p>
                  
                  <p style="font-size: 12px; color: #999; margin-top: 15px;">
                      © ${new Date().getFullYear()} DEFI. All rights reserved.
                  </p>
                  
                  <div class="social-links">
                      <a href="#">Privacy Policy</a> • 
                      <a href="#">Terms of Service</a> • 
                      <a href="#">Unsubscribe</a>
                  </div>
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
