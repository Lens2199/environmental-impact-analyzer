import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productAPI = {
  // Get all products
  getAllProducts: () => api.get('/products'),
  
  // Get a single product by ID
  getProductById: (id) => api.get(`/products/${id}`),
  
  // Search products
  searchProducts: (query) => api.get(`/products/search/${query}`),
  
  // Create a new product
  createProduct: (productData) => api.post('/products', productData),
  
  // Update a product
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  
  // Delete a product
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// Analysis API
export const analysisAPI = {
  // Analyze product from text description
  analyzeProductText: (productText) => api.post('/analysis/analyze-text', { productText }),
  
  // Analyze existing product by ID
  analyzeExistingProduct: (productId) => api.post(`/analysis/analyze-product/${productId}`),
  
  // Get analysis history
  getAnalysisHistory: () => api.get('/analysis/history'),
  
  // Get analysis by ID
  getAnalysisById: (id) => api.get(`/analysis/${id}`),
  
  // Compare multiple products
  compareProducts: (productIds) => api.post('/analysis/compare', { productIds }),
};

export default {
  products: productAPI,
  analysis: analysisAPI,
};