require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { getConfig } = require('./config/env.config');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const vendorRoutes = require('./routes/vendor');
const buyerRoutes = require('./routes/buyer');
const paymentRoutes = require('./routes/payment');

// Initialize express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: getConfig('FRONTEND_URL'),
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging in development
if (getConfig('NODE_ENV') === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Paperbox API is running',
    timestamp: new Date().toISOString(),
    environment: getConfig('NODE_ENV')
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api', buyerRoutes); // Buyer routes are at root /api for products, orders, etc.
app.use('/api/payment', paymentRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = getConfig('PORT');
const server = app.listen(PORT, () => {
  console.log(`
  🚀 Paperbox Backend Server
  ========================
  Environment: ${getConfig('NODE_ENV')}
  Port: ${PORT}
  API: http://localhost:${PORT}/api
  Health: http://localhost:${PORT}/api/health
  ========================
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

module.exports = app;
