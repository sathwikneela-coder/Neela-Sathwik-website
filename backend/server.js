require('dotenv').config();
const express = require('express');
const cors = require('cors');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS for local development and Vercel production domains
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim().replace(/\/$/, ''))
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    // Always allow local development
    if (
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }

    // Allow configured production origins
    if (allowedOrigins.length > 0) {
      const isAllowed = allowedOrigins.some(allowed => {
        // Support exact match or subdomain matching for Vercel preview URLs
        if (allowed === origin) return true;
        if (allowed.includes('*')) {
          const pattern = new RegExp('^' + allowed.replace(/\*/g, '.*') + '$');
          return pattern.test(origin);
        }
        return false;
      });

      if (isAllowed) {
        return callback(null, true);
      }
    }

    // Allow Vercel app domain patterns by default if FRONTEND_URL is not strictly set
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS policy'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoints
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/contact', contactRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server on 0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT} (0.0.0.0:${PORT})`);
});

module.exports = app;
