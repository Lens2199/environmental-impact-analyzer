// Import required modules
const Product = require('../models/Product');
const Analysis = require('../models/Analysis');
const { generateProductAnalysis, generateProductComparison } = require('../config/openai');
const { parseAnalysisResponse, generateComparisonSummary } = require('../utils/parseAnalysis');

/**
 * Analyze product based on text description
 * @route POST /api/analysis/analyze-text
 */
exports.analyzeProductText = async (req, res, next) => {
  try {
    const { productText } = req.body;
    
    if (!productText || productText.trim() === '') {
      return res.status(400).json({ message: 'Product text is required' });
    }

    // Generate analysis using OpenAI
    const analysisText = await generateProductAnalysis(productText);
    
    // Parse the analysis to extract scores and explanation
    const analysisResult = parseAnalysisResponse(analysisText);
    
    // Create new analysis record
    const analysis = await Analysis.createAnalysis({
      productDescription: productText,
      scores: analysisResult.scores,
      explanation: analysisResult.explanation,
      suggestions: analysisResult.suggestions,
      rawAnalysis: analysisText
    });
    
    res.status(200).json(analysis);
  } catch (error) {
    next(error);
  }
};

/**
 * Analyze existing product by ID
 * @route POST /api/analysis/analyze-product/:id
 */
exports.analyzeExistingProduct = async (req, res, next) => {
  try {
    const product = await Product.getProductById(req.params.id);
    
    // Check if recent analysis exists
    const forceReanalysis = req.query.force === 'true';
    
    if (!forceReanalysis) {
      const existingAnalysis = await Analysis.getRecentProductAnalysis(product.id, 24); // 24 hours
      
      if (existingAnalysis) {
        return res.status(200).json({
          ...existingAnalysis,
          message: 'Using existing recent analysis. Set ?force=true to reanalyze.'
        });
      }
    }
    
    // Combine product details for analysis
    const productText = `
      Product Name: ${product.name}
      Description: ${product.description}
      Category: ${product.category}
      Materials: ${product.materials.join(', ')}
      Manufacturing Location: ${product.manufacturing_location}
      Additional Details: ${product.additional_details || 'None'}
    `;
    
    // Generate analysis using OpenAI
    const analysisText = await generateProductAnalysis(productText);
    const analysisResult = parseAnalysisResponse(analysisText);
    
    // Create new analysis record
    const analysis = await Analysis.createAnalysis({
      product: product.id,
      productDescription: productText,
      scores: analysisResult.scores,
      explanation: analysisResult.explanation,
      suggestions: analysisResult.suggestions,
      rawAnalysis: analysisText
    });
    
    res.status(200).json(analysis);
  } catch (error) {
    next(error);
  }
};

/**
 * Get analysis history
 * @route GET /api/analysis/history
 */
exports.getAnalysisHistory = async (req, res, next) => {
  try {
    // Apply pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await Analysis.getAnalysisHistory({ page, limit });
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get analysis by ID
 * @route GET /api/analysis/:id
 */
exports.getAnalysisById = async (req, res, next) => {
  try {
    const analysis = await Analysis.getAnalysisById(req.params.id);
    res.status(200).json(analysis);
  } catch (error) {
    next(error);
  }
};

/**
 * Get latest analysis for a product
 * @route GET /api/analysis/product/:id
 */
exports.getProductAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.getLatestProductAnalysis(req.params.id);
    res.status(200).json(analysis);
  } catch (error) {
    next(error);
  }
};

/**
 * Compare multiple products
 * @route POST /api/analysis/compare
 */
exports.compareProducts = async (req, res, next) => {
  try {
    const { productIds } = req.body;
    
    if (!productIds || !Array.isArray(productIds) || productIds.length < 2) {
      return res.status(400).json({ message: 'At least two product IDs are required for comparison' });
    }
    
    if (productIds.length > 3) {
      return res.status(400).json({ message: 'Maximum 3 products can be compared at once' });
    }
    
    // Get the latest analysis for each product
    const analyses = await Analysis.getAnalysesForComparison(productIds);
    
    // Check if all products have analyses
    if (analyses.length !== productIds.length) {
      const missingProductIds = productIds.filter(id => 
        !analyses.some(analysis => analysis.product && analysis.product.id === id)
      );
      
      try {
        // Get missing product names
        const missingProducts = await Promise.all(
          missingProductIds.map(id => Product.getProductById(id))
        );
        
        const missingNames = missingProducts.map(p => p.name).join(', ');
        
        return res.status(404).json({ 
          message: `Some products have not been analyzed yet: ${missingNames}`,
          missingProductIds
        });
      } catch (err) {
        return res.status(404).json({ 
          message: 'Some products have not been analyzed yet',
          missingProductIds
        });
      }
    }
    
    // Generate comprehensive comparison using OpenAI (optional)
    let comparisonText = null;
    if (req.query.detailed === 'true') {
      comparisonText = await generateProductComparison(analyses);
    }
    
    // Create comparison object
    const comparison = {
      products: analyses.map(analysis => ({
        id: analysis.product.id,
        name: analysis.product.name,
        category: analysis.product.category,
        materials: analysis.product.materials,
        manufacturingLocation: analysis.product.manufacturing_location,
        imageUrl: analysis.product.image_url,
        scores: analysis.scores,
        explanation: analysis.explanation,
        createdAt: analysis.createdAt
      })),
      summary: generateComparisonSummary(analyses),
      detailedComparison: comparisonText
    };
    
    res.status(200).json(comparison);
  } catch (error) {
    next(error);
  }
};