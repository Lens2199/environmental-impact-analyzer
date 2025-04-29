// Import required modules
const OpenAI = require('openai');
// Import models (to be created)
const Analysis = require('../models/Analysis');
const Product = require('../models/Product');

// Configure OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Analyze product based on text description
exports.analyzeProductText = async (req, res) => {
  try {
    const { productText } = req.body;
    
    if (!productText) {
      return res.status(400).json({ message: 'Product text is required' });
    }

    // OpenAI API call to analyze product description
    const response = await openai.chat.completions.create({
      model: "gpt-4", // or other appropriate model
      messages: [
        {
          role: "system",
          content: "You are an environmental impact analyzer. Analyze the following product description and provide an environmental impact assessment with scores for carbon footprint, water usage, resource consumption, and overall sustainability on a scale of 1-10 (10 being most sustainable). Also provide a brief explanation and suggestions for improvement."
        },
        {
          role: "user",
          content: productText
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Extract analysis from OpenAI response
    const analysisText = response.choices[0].message.content;
    
    // Parse the analysis to extract scores and explanation
    // This is a simplified version - in a real app, you would implement 
    // more robust parsing or structure the prompt differently
    const analysisResult = parseAnalysisResponse(analysisText);
    
    // Create new analysis record
    const analysis = new Analysis({
      productDescription: productText,
      scores: analysisResult.scores,
      explanation: analysisResult.explanation,
      suggestions: analysisResult.suggestions,
      rawAnalysis: analysisText
    });
    
    await analysis.save();
    
    res.status(200).json(analysis);
  } catch (error) {
    console.error('Error analyzing product:', error);
    res.status(500).json({ message: 'Error analyzing product', error: error.message });
  }
};

// Analyze existing product by ID
exports.analyzeExistingProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Combine product details for analysis
    const productText = `
      Product Name: ${product.name}
      Description: ${product.description}
      Category: ${product.category}
      Materials: ${product.materials.join(', ')}
      Manufacturing Location: ${product.manufacturingLocation}
      Additional Details: ${product.additionalDetails || 'None'}
    `;
    
    // Make request to OpenAI with the product text
    // This is similar to the analyzeProductText method
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an environmental impact analyzer. Analyze the following product information and provide an environmental impact assessment with scores for carbon footprint, water usage, resource consumption, and overall sustainability on a scale of 1-10 (10 being most sustainable). Also provide a brief explanation and suggestions for improvement."
        },
        {
          role: "user",
          content: productText
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const analysisText = response.choices[0].message.content;
    const analysisResult = parseAnalysisResponse(analysisText);
    
    // Create new analysis record
    const analysis = new Analysis({
      product: product._id,
      productDescription: productText,
      scores: analysisResult.scores,
      explanation: analysisResult.explanation,
      suggestions: analysisResult.suggestions,
      rawAnalysis: analysisText
    });
    
    await analysis.save();
    
    res.status(200).json(analysis);
  } catch (error) {
    console.error('Error analyzing product:', error);
    res.status(500).json({ message: 'Error analyzing product', error: error.message });
  }
};

// Get analysis history
exports.getAnalysisHistory = async (req, res) => {
  try {
    const analyses = await Analysis.find().populate('product');
    res.status(200).json(analyses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analysis history', error: error.message });
  }
};

// Get analysis by ID
exports.getAnalysisById = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id).populate('product');
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }
    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analysis', error: error.message });
  }
};

// Compare multiple products
exports.compareProducts = async (req, res) => {
  try {
    const { productIds } = req.body;
    
    if (!productIds || !Array.isArray(productIds) || productIds.length < 2) {
      return res.status(400).json({ message: 'At least two product IDs are required for comparison' });
    }
    
    // Get analyses for all products
    const analyses = await Analysis.find({
      product: { $in: productIds }
    }).populate('product');
    
    if (analyses.length !== productIds.length) {
      return res.status(404).json({ message: 'One or more products have not been analyzed yet' });
    }
    
    // Create comparison object
    const comparison = {
      products: analyses.map(analysis => ({
        id: analysis.product._id,
        name: analysis.product.name,
        scores: analysis.scores,
        explanation: analysis.explanation
      })),
      summary: generateComparisonSummary(analyses)
    };
    
    res.status(200).json(comparison);
  } catch (error) {
    res.status(500).json({ message: 'Error comparing products', error: error.message });
  }
};

// Helper function to parse the OpenAI analysis response
function parseAnalysisResponse(analysisText) {
  // This is a simplified parser
  // In a real application, you would implement a more robust parsing logic
  // or structure the OpenAI prompt to return a specific format (like JSON)
  
  // Example implementation:
  const scores = {
    carbon: extractScore(analysisText, 'carbon') || 5,
    water: extractScore(analysisText, 'water') || 5,
    resources: extractScore(analysisText, 'resource') || 5,
    overall: extractScore(analysisText, 'overall') || extractScore(analysisText, 'sustainability') || 5
  };
  
  // Extract explanation (simplified)
  const explanationMatch = analysisText.match(/explanation:(.+?)(suggestions:|$)/is);
  const explanation = explanationMatch ? explanationMatch[1].trim() : 'No explanation provided';
  
  // Extract suggestions (simplified)
  const suggestionsMatch = analysisText.match(/suggestions:(.+)$/is);
  const suggestions = suggestionsMatch ? suggestionsMatch[1].trim() : 'No suggestions provided';
  
  return {
    scores,
    explanation,
    suggestions
  };
}

// Helper function to extract scores from analysis text
function extractScore(text, category) {
  const regex = new RegExp(`${category}[^\\d]+(\\d+)`, 'i');
  const match = text.match(regex);
  return match ? parseInt(match[1], 10) : null;
}

// Helper function to generate comparison summary
function generateComparisonSummary(analyses) {
  // Find the product with the best overall score
  const bestProduct = [...analyses].sort((a, b) => 
    b.scores.overall - a.scores.overall
  )[0];
  
  // Calculate average scores across all products
  const avgScores = {
    carbon: 0,
    water: 0,
    resources: 0,
    overall: 0
  };
  
  analyses.forEach(analysis => {
    avgScores.carbon += analysis.scores.carbon;
    avgScores.water += analysis.scores.water;
    avgScores.resources += analysis.scores.resources;
    avgScores.overall += analysis.scores.overall;
  });
  
  Object.keys(avgScores).forEach(key => {
    avgScores[key] = avgScores[key] / analyses.length;
  });
  
  return {
    bestProduct: {
      id: bestProduct.product._id,
      name: bestProduct.product.name,
      score: bestProduct.scores.overall
    },
    averageScores: avgScores
  };
}