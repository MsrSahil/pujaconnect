import express from 'express';
import cors from 'cors';
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

// ── Body parsers ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── CORS ──
app.use(
  cors({
    origin: ENV.CLIENT_URL,
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
