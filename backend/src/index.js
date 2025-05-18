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

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
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
    
    // Seed database with sample data in development mode
    if (process.env.NODE_ENV !== 'production' && process.env.SEED_DB === 'true') {
      await seedDatabase();
    }
    
    // Start listening for requests
    const PORT = 5010; // Hard-coded port number
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Run the server
startServer();