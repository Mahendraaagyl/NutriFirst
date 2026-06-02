import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import authRoutes from './routes/auth.routes.js';
import recommendRoutes from './routes/recommend.routes.js';

const app = express();



// MIDDLEWARE


// CORS - izinkan frontend kirim cookie
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parser
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());


// ROUTES


// Health check (untuk monitoring & test)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'NutriFirst Backend',
  });
});

// Mounted routes
app.use('/api/auth', authRoutes);
app.use('/api/recommend', recommendRoutes);



// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Terjadi kesalahan server.',
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  });
});

export default app;
