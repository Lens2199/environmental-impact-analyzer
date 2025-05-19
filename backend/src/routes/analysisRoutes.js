const express = require('express');
const router = express.Router();

// Import controller
const analysisController = require('../controllers/analysisController');

// Routes
router.post('/analyze-text', analysisController.analyzeProductText);
router.post('/analyze-product/:id', analysisController.analyzeExistingProduct);
router.get('/history', analysisController.getAnalysisHistory);
router.get('/product/:id', analysisController.getProductAnalysis); // Add this line
router.get('/:id', analysisController.getAnalysisById);
router.post('/compare', analysisController.compareProducts);

module.exports = router;