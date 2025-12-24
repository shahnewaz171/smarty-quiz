import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { auth } from './lib/auth.js';
import { requireAuth, requireAdmin } from './middleware/auth.js';
import quizRoutes from './routes/quiz.js';
import adminRoutes from './routes/admin.js';
import { HeadersInit } from './types/index.js';

const app = express();
const PORT = process.env.PORT || 4001;

app.use(
  cors({
    origin: process.env.CLIENT_APP_URL,
    credentials: true
  })
);
app.use(express.json());

// authentication routes
app.all('/api/auth/**', async (req, res) => {
  try {
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    const request = new Request(url, {
      method: req.method,
      headers: req.headers as HeadersInit,
      body: ['POST', 'PUT'].includes(req.method) && req.body ? JSON.stringify(req.body) : undefined
    });

    const response = await auth.handler(request);

    if (!response) {
      return res.status(404).json({ error: 'Authentication endpoint not found' });
    }

    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const text = await response.text();
    return res.status(response.status).send(text);
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      error: 'Authentication failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// protected routes
app.use('/api/quizzes', requireAuth, quizRoutes);
app.use('/api/admin', requireAdmin, adminRoutes);

// health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// error handler
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.log('Server error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
