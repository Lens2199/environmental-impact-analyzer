/**
 * Utility functions for parsing OpenAI API responses into structured analysis data
 */

/**
 * Parse the raw analysis text from OpenAI into structured scores and text
 * @param {string} analysisText - The raw text response from OpenAI API
 * @returns {Object} Structured analysis data with scores, explanation, and suggestions
 */
const parseAnalysisResponse = (analysisText) => {
    try {
      // Extract scores for each category
      const scores = {
        carbon: extractScore(analysisText, 'carbon') || 5,
        water: extractScore(analysisText, 'water') || 5,
        resources: extractScore(analysisText, 'resource') || 5,
        overall: extractScore(analysisText, 'overall') || extractScore(analysisText, 'sustainability') || 5
      };
      
      // Extract explanation
      const explanationMatch = analysisText.match(/explanation:(.+?)(suggestions:|$)/is);
      const explanation = explanationMatch 
        ? explanationMatch[1].trim() 
        : 'No detailed explanation was provided for this product.';
      
      // Extract suggestions
      const suggestionsMatch = analysisText.match(/suggestions:(.+)$/is);
      const suggestions = suggestionsMatch 
        ? suggestionsMatch[1].trim() 
        : 'No specific suggestions were provided for improving this product.';
      
      return {
        scores,
        explanation,
        suggestions
      };
    } catch (error) {
      console.error('Error parsing analysis response:', error);
      
      // Return default values if parsing fails
      return {
        scores: {
          carbon: 5,
          water: 5,
          resources: 5,
          overall: 5
        },
        explanation: 'Unable to parse detailed analysis. Please try again or provide more product information.',
        suggestions: 'Unable to generate improvement suggestions. Please try again with more specific product details.'
      };
    }
  };
  
  /**
   * Extract a numeric score from the analysis text for a specific category
   * @param {string} text - The full analysis text
   * @param {string} category - The category to extract score for (carbon, water, resources, overall)
   * @returns {number|null} The extracted score or null if not found
   */
  const extractScore = (text, category) => {
    // Try different patterns to match scores
    const patterns = [
      // Format: "Carbon Footprint: 8/10"
      new RegExp(`${category}[^\\d]+(\\d+)\\s*\\/\\s*10`, 'i'),
      // Format: "Carbon Footprint Score: 8"
      new RegExp(`${category}[^\\d]+(\\d+)`, 'i'),
      // Format: "Carbon: 8"
      new RegExp(`${category}[\\s:]+([1-9])`, 'i')
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const score = parseInt(match[1], 10);
        // Ensure score is within valid range (1-10)
        if (score >= 1 && score <= 10) {
          return score;
        }
      }
    }
    
    return null;
  };
  
  /**
   * Generate a comparison summary between multiple product analyses
   * @param {Array} analyses - Array of analysis objects
   * @returns {Object} Comparison summary with best product and average scores
   */
  const generateComparisonSummary = (analyses) => {
    if (!analyses || analyses.length === 0) {
      return null;
    }
    
    // Find the product with the best overall score
    const bestAnalysis = [...analyses].sort((a, b) => 
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
        id: bestAnalysis.product ? bestAnalysis.product._id : 'unknown',
        name: bestAnalysis.product ? bestAnalysis.product.name : 'Most Sustainable Option',
        score: bestAnalysis.scores.overall
      },
      averageScores: avgScores
    };
  };
  
  module.exports = {
    parseAnalysisResponse,
    extractScore,
    generateComparisonSummary
  };