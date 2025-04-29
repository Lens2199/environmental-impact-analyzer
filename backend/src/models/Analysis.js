/**
 * Analysis model for Supabase
 * Handles interactions with the 'analyses' table
 */
const { supabase } = require('../config/database');

/**
 * Create a new analysis
 * 
 * @param {Object} analysisData - Analysis data
 * @returns {Promise<Object>} - Created analysis
 */
const createAnalysis = async (analysisData) => {
  // Transform data structure for Supabase
  const analysis = {
    product_id: analysisData.product || null,
    product_description: analysisData.productDescription,
    carbon_score: analysisData.scores.carbon,
    water_score: analysisData.scores.water,
    resources_score: analysisData.scores.resources,
    overall_score: analysisData.scores.overall,
    explanation: analysisData.explanation,
    suggestions: analysisData.suggestions,
    raw_analysis: analysisData.rawAnalysis
  };

  const { data, error } = await supabase
    .from('analyses')
    .insert([analysis])
    .select();

  if (error) {
    throw new Error(`Error creating analysis: ${error.message}`);
  }

  // Transform back to API format
  const result = transformAnalysisToApiFormat(data[0]);

  return result;
};

/**
 * Get an analysis by ID
 * 
 * @param {string} id - Analysis ID
 * @returns {Promise<Object>} - Analysis data
 */
const getAnalysisById = async (id) => {
  const { data, error } = await supabase
    .from('analyses')
    .select(`
      *,
      products:product_id (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Analysis not found');
    }
    throw new Error(`Error fetching analysis: ${error.message}`);
  }

  return transformAnalysisToApiFormat(data);
};

/**
 * Get analysis history with pagination
 * 
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Items per page
 * @returns {Promise<Object>} - Paginated analyses
 */
const getAnalysisHistory = async (options = {}) => {
  const { page = 1, limit = 10 } = options;

  // Calculate pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('analyses')
    .select(`
      *,
      products:product_id (*)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Error fetching analysis history: ${error.message}`);
  }

  // Transform data format
  const analyses = data.map(transformAnalysisToApiFormat);

  return {
    analyses,
    pagination: {
      total: count,
      page,
      pages: Math.ceil(count / limit)
    }
  };
};

/**
 * Get the latest analysis for a product
 * 
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} - Latest analysis
 */
const getLatestProductAnalysis = async (productId) => {
  const { data, error } = await supabase
    .from('analyses')
    .select(`
      *,
      products:product_id (*)
    `)
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('No analysis found for this product');
    }
    throw new Error(`Error fetching analysis: ${error.message}`);
  }

  return transformAnalysisToApiFormat(data);
};

/**
 * Check if a recent analysis exists for a product
 * 
 * @param {string} productId - Product ID
 * @param {number} hoursThreshold - Hours threshold for "recent"
 * @returns {Promise<Object|null>} - Recent analysis or null
 */
const getRecentProductAnalysis = async (productId, hoursThreshold = 24) => {
  // Calculate date threshold
  const threshold = new Date();
  threshold.setHours(threshold.getHours() - hoursThreshold);
  
  const { data, error } = await supabase
    .from('analyses')
    .select(`
      *,
      products:product_id (*)
    `)
    .eq('product_id', productId)
    .gt('created_at', threshold.toISOString())
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(`Error checking for recent analysis: ${error.message}`);
  }

  if (data.length === 0) {
    return null;
  }

  return transformAnalysisToApiFormat(data[0]);
};

/**
 * Get analyses for multiple products (for comparison)
 * 
 * @param {Array} productIds - Array of product IDs
 * @returns {Promise<Array>} - Latest analysis for each product
 */
const getAnalysesForComparison = async (productIds) => {
  if (!Array.isArray(productIds) || productIds.length === 0) {
    return [];
  }

  // For each product, we need to get the most recent analysis
  const analyses = [];

  for (const productId of productIds) {
    try {
      const analysis = await getLatestProductAnalysis(productId);
      analyses.push(analysis);
    } catch (error) {
      console.error(`Error fetching analysis for product ${productId}:`, error);
      // Continue with other products
    }
  }

  return analyses;
};

/**
 * Helper function to transform analysis data from Supabase format to API format
 * 
 * @param {Object} data - Raw analysis data from Supabase
 * @returns {Object} - Transformed data for API
 */
const transformAnalysisToApiFormat = (data) => {
  if (!data) return null;
  
  return {
    _id: data.id,
    product: data.products || data.product_id,
    productDescription: data.product_description,
    scores: {
      carbon: data.carbon_score,
      water: data.water_score,
      resources: data.resources_score,
      overall: data.overall_score
    },
    explanation: data.explanation,
    suggestions: data.suggestions,
    rawAnalysis: data.raw_analysis,
    createdAt: data.created_at
  };
};

module.exports = {
  createAnalysis,
  getAnalysisById,
  getAnalysisHistory,
  getLatestProductAnalysis,
  getRecentProductAnalysis,
  getAnalysesForComparison
};