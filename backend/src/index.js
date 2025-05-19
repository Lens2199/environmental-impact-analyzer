// src/services/api.js
import apiService from './apiService';

/**
 * Product API methods
 */
export const productAPI = {
  // Get all products with optional filters
  getAllProducts: async (options = {}) => {
    const params = new URLSearchParams();
    
    if (options.category) params.append('category', options.category);
    if (options.sort) params.append('sort', options.sort);
    if (options.page) params.append('page', options.page);
    if (options.limit) params.append('limit', options.limit);
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await apiService.get(`/products${queryString}`);
  },
  
  // Get product by ID
  getProductById: async (id) => {
    return await apiService.get(`/products/${id}`);
  },
  
  // Search products
  searchProducts: async (query) => {
    return await apiService.get(`/products/search/${encodeURIComponent(query)}`);
  },
  
  // Get products by category
  getProductsByCategory: async (category) => {
    return await apiService.get(`/products/category/${encodeURIComponent(category)}`);
  },
  
  // Create a new product
  createProduct: async (productData) => {
    return await apiService.post('/products', productData);
  },
  
  // Update a product
  updateProduct: async (id, productData) => {
    return await apiService.put(`/products/${id}`, productData);
  },
  
  // Delete a product
  deleteProduct: async (id) => {
    return await apiService.delete(`/products/${id}`);
  }
};

/**
 * Analysis API methods
 */
export const analysisAPI = {
  // Analyze product using text description
  analyzeProductText: async (productText) => {
    return await apiService.post('/analysis/analyze-text', { productText });
  },
  
  // Analyze existing product by ID
  analyzeExistingProduct: async (productId, force = false) => {
    return await apiService.post(`/analysis/analyze-product/${productId}${force ? '?force=true' : ''}`);
  },
  
  // Get latest analysis for product
  getProductAnalysis: async (productId) => {
    return await apiService.get(`/analysis/product/${productId}`);
  },
  
  // This was missing! Match the method name expected by ComparisonPage.js
  getAnalysisByProductId: async (productId) => {
    return await apiService.get(`/analysis/product/${productId}`);
  },
  
  // Get analysis by ID
  getAnalysisById: async (id) => {
    return await apiService.get(`/analysis/${id}`);
  },
  
  // Get analysis history (with pagination)
  getAnalysisHistory: async (page = 1, limit = 10) => {
    return await apiService.get(`/analysis/history?page=${page}&limit=${limit}`);
  },
  
  // Compare multiple products
  compareProducts: async (productIds, detailed = false) => {
    return await apiService.post(`/analysis/compare${detailed ? '?detailed=true' : ''}`, { productIds });
  }
};

export default {
  productAPI,
  analysisAPI
};