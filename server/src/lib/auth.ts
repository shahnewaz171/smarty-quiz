import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { sendEmail, emailTemplates } from '../services/email.js';
import { isProduction } from '../utils/env.js';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      users: schema.users,
      session: schema.session,
      account: schema.account,
      verification: schema.verification
    }
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      const template = emailTemplates.passwordReset(url, user.name);

      await sendEmail({
        to: user.email,
        subject: template.subject,
        html: template.html
      });
      console.log(`Password reset email sent to ${user.email}`);
    },
    onPasswordReset: async ({ user }) => {
      const template = emailTemplates.passwordResetConfirmation(user.name);

      await sendEmail({
        to: user.email,
        subject: template.subject,
        html: template.html
      });
      console.log(`Password reset confirmation email sent to ${user.email}`);
    }
  },
  trustedOrigins: [process.env.CLIENT_APP_URL || ''],
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || '',
  user: {
    modelName: 'users',
    additionalFields: {
      role: {
        type: 'json',
        defaultValue: ['user'],
        required: true
      }
    }
  },
  advanced: {
    useSecureCookies: isProduction,
    // cookiePrefix: '',
    // useSecureCookies: true,
    cookies: {
      session_token: {
        name: 'session_token',
        attributes: {
          sameSite: isProduction ? 'none' : 'lax',
          secure: isProduction
        }
      }
      // crossSubDomainCookies: {
      //   enabled: true,
      //   domain: 'localhost'
      // }
    }
  }
});
