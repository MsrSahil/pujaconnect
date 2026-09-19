import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { ENV } from './config/env.js';
import errorHandler from './middlewares/error.middleware.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import panditRoutes from './routes/pandit.routes.js';
import pujaRoutes from './routes/puja.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import adminRoutes from './routes/admin.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

// ── Security Headers ──
app.use(helmet());

// ── Body parsers ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── NoSQL Injection Sanitization ──
// Strips $ and . characters from user-supplied input in body, query, and params
app.use(mongoSanitize());

// ── CORS ──
// Support comma-separated origins (e.g. "http://localhost:5173,https://pujaconnect.vercel.app")
const allowedOrigins = (ENV.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((url) => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, uptime monitors, server-to-server)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/+$/, '');
      if (allowedOrigins.includes(normalizedOrigin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked access from origin: ${origin}`));
    },
    credentials: true,
  })
);

// ── Health check ──
app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'PujaConnect API is running 🙏',
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ──
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/pandits', panditRoutes);
app.use('/api/v1/pujas', pujaRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admin', adminRoutes);

// ── 404 handler ──
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ── Global error handler (must be last) ──
app.use(errorHandler);

export default app;
