// Load environment variables
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Import configuration - make sure this is the updated file for Supabase
const { connectDB, seedDatabase } = require('./config/database');

// Import routes
const productRoutes = require('./routes/productRoutes');
const analysisRoutes = require('./routes/analysisRoutes');

// Initialize Express app
const app = express();

// Set up CORS with environment variable for origin
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/analysis', analysisRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    status: 'online',
    message: 'Environmental Impact Analyzer API is running',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// API documentation route
app.get('/api', (req, res) => {
  res.json({
    message: 'Environmental Impact Analyzer API',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      analysis: '/api/analysis'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error(err.stack);
  
  res.status(500).json({ 
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.stack
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to Supabase
    const connected = await connectDB();
    
    if (!connected) {
      console.error('Failed to connect to database. Exiting.');
      process.exit(1);
    }
    
    // Seed database with sample data if enabled
    if (process.env.NODE_ENV !== 'production' && process.env.SEED_DB === 'true') {
      console.log('Seeding database...');
      await seedDatabase();
      console.log('Database seeded successfully');
    }
    
    // Get port from environment variable or use default
    const PORT = process.env.PORT || 5010;
    
    // Start listening for requests
    app.listen(PORT, () => {
      const appUrl = process.env.NODE_ENV === 'production' 
        ? 'https://environmental-impact-analyzer.onrender.com' 
        : `http://localhost:${PORT}`;
        
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔒 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
      console.log(`🚀 API available at: ${appUrl}/api`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    console.error(error.stack);
    process.exit(1);
  }
};

// Handle unexpected errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

// Run the server
startServer();