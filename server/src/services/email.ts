import { createMailgunClient } from '../lib/mailgun.js';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// send email
export const sendEmail = async ({ to, subject, html }: EmailOptions): Promise<void> => {
  try {
    const mg = createMailgunClient();
    const domain = process.env.MAILGUN_DOMAIN || '';

    if (!domain) {
      throw new Error('MAILGUN_DOMAIN is not configured');
    }

    const messageData = {
      from: process.env.EMAIL_FROM || ``,
      to: [to],
      subject,
      html
    };

    const response = await mg.messages.create(domain, messageData);

    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 Email sent via Mailgun:', {
        id: response.id,
        message: response.message,
        to,
        subject
      });
    }
  } catch (error) {
    console.error('Failed to send email via Mailgun:', error);
    throw new Error('Failed to send email');
  }
};

// email templates
export const emailTemplates = {
  passwordReset: (resetUrl: string, userName?: string) => ({
    subject: 'Reset Your Password - Smarty Quiz',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #ffffff !important;
              border-radius: 8px;
              padding: 40px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            h1 {
              color: #1976d2;
              margin: 0 0 10px 0;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #1976d2 !important;
              color: #ffffff !important;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: 500;
            }
            .button:hover {
              background-color: #1565c0 !important;
            }
            .info-box {
              background-color: #f5f5f5 !important;
              border-left: 4px solid #ff9800;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
              font-size: 12px;
              color: #666 !important;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Reset Your Password</h1>
            </div>
            
            <p>Hi ${userName || 'there'},</p>
            
            <p>We received a request to reset your password for your Smarty Quiz account. Click the button below to create a new password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <div class="info-box">
              <strong>⏰ Important:</strong> This link will expire in 1 hour for security reasons.
            </div>
            
            <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            
            <p>For security reasons, please don't share this link with anyone.</p>
            
            <div class="footer">
              <p>This is an automated message from Smarty Quiz. Please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} Smarty Quiz. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  passwordResetConfirmation: (userName?: string) => ({
    subject: 'Password Successfully Reset - Smarty Quiz',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #ffffff !important;
              border-radius: 8px;
              padding: 40px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            h1 {
              color: #2e7d32;
              margin: 0 0 10px 0;
            }
            .success-icon {
              font-size: 48px;
              text-align: center;
              margin-bottom: 20px;
            }
            .info-box {
              background-color: #e8f5e9 !important;
              border-left: 4px solid #4caf50;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .security-tips {
              background-color: #fff3e0 !important;
              border-left: 4px solid #ff9800;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
              font-size: 12px;
              color: #666 !important;
              text-align: center;
            }
            ul {
              margin: 10px 0;
              padding-left: 20px;
            }
            li {
              margin: 5px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success-icon">✅</div>
            
            <div class="header">
              <h1>Password Successfully Reset</h1>
            </div>
            
            <p>Hi ${userName || 'there'},</p>
            
            <div class="info-box">
              <strong>🎉 Great news!</strong> Your password has been successfully reset.
            </div>
            
            <p>You can now log in to your Smarty Quiz account using your new password.</p>
            
            <div class="security-tips">
              <strong>🔒 Security Tips:</strong>
              <ul>
                <li>If you didn't make this change, please contact us immediately</li>
                <li>Never share your password with anyone</li>
                <li>Use a unique password for your Smarty Quiz account</li>
                <li>Consider enabling two-factor authentication for extra security</li>
              </ul>
            </div>
            
            <p>If you have any questions or concerns about your account security, please don't hesitate to contact our support team.</p>
            
            <div class="footer">
              <p>This is an automated message from Smarty Quiz. Please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} Smarty Quiz. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  })
};
