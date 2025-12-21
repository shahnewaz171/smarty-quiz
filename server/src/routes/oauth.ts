import { Router } from 'express';
import { google } from 'googleapis';

const router = Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_OAUTH2_CLIENT_ID,
  process.env.GMAIL_OAUTH2_CLIENT_SECRET,
  `${process.env.BETTER_AUTH_URL}/api/oauth/callback`
);

// initiation route
router.get('/auth', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Required to get refresh token
    scope: ['https://mail.google.com/'], // Gmail send permission
    prompt: 'consent' // Force consent screen to get refresh token
  });

  return res.redirect(authUrl);
});

// callback to exchange code for tokens
router.get('/callback', async (req, res) => {
  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>OAuth2 Tokens - Quiz Builder</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              max-width: 800px;
              margin: 50px auto;
              padding: 20px;
              background: #f5f5f5;
            }
            .container {
              background: white;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            h1 {
              color: #1976d2;
            }
            .token-box {
              background: #f5f5f5;
              padding: 15px;
              border-radius: 4px;
              margin: 10px 0;
              border-left: 4px solid #1976d2;
            }
            code {
              background: #263238;
              color: #aed581;
              padding: 2px 6px;
              border-radius: 3px;
              font-family: 'Monaco', 'Courier New', monospace;
              word-break: break-all;
            }
            .success {
              background: #e8f5e9;
              border-left-color: #4caf50;
              padding: 15px;
              border-radius: 4px;
              margin: 20px 0;
            }
            .warning {
              background: #fff3e0;
              border-left: 4px solid #ff9800;
              padding: 15px;
              border-radius: 4px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✅ OAuth2 Authentication Successful!</h1>
            
            <div class="success">
              <strong>Great!</strong> Your Gmail OAuth2 tokens have been generated.
            </div>

            <h2>📋 Add these to your .env file:</h2>
            
            <div class="token-box">
              <strong>Access Token:</strong><br>
              <code>${tokens.access_token || 'Not provided'}</code>
            </div>

            <div class="token-box">
              <strong>Refresh Token:</strong><br>
              <code>${tokens.refresh_token || 'Not provided (may already exist)'}</code>
            </div>

            <div class="warning">
              <strong>⚠️ Important:</strong> Copy these values to your <code>server/.env</code> file:
              <pre style="margin-top: 10px; background: #263238; color: #aed581; padding: 15px; border-radius: 4px; overflow-x: auto;">
GMAIL_OAUTH2_ACCESS_TOKEN=${tokens.access_token || ''}
GMAIL_OAUTH2_REFRESH_TOKEN=${tokens.refresh_token || '(use existing one)'}</pre>
            </div>

            <h3>📝 Notes:</h3>
            <ul>
              <li><strong>Access Token</strong>: Expires in ~1 hour (auto-refreshed by nodemailer)</li>
              <li><strong>Refresh Token</strong>: Keep this safe! It's used to get new access tokens</li>
              <li>If refresh token is not shown, you may already have one. Check your existing .env</li>
              <li>After adding to .env, restart your server</li>
            </ul>

            <p style="margin-top: 30px;">
              <a href="/" style="color: #1976d2; text-decoration: none;">← Back to Home</a>
            </p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    return res.status(500).json({
      error: 'Failed to exchange authorization code for tokens',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
