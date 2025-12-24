import FormData from 'form-data';
import Mailgun from 'mailgun.js';

export const createMailgunClient = () => {
  const mailgun = new Mailgun(FormData);

  return mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY || '',
    url: process.env.MAILGUN_API_URL || ''
  });
};
