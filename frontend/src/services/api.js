import api from './apiService';

// Products API
export const productAPI = {
  // Get all products
  getAllProducts: (params = {}) => 
    api.get('/products', params),
  
  // Get a single product by ID
  getProductById: (id) => {
    if (!id || id === 'undefined') {
      console.error('Invalid product ID:', id);
      return Promise.reject(new Error('Invalid product ID'));
    }
    return api.get(`/products/${id}`);
  },
  
  // Search products
  searchProducts: (query, params = {}) => 
    api.get(`/products/search/${query}`, params),
  
  // Create a new product
  createProduct: (productData) => 
    api.post('/products', productData),
  
  // Update a product
  updateProduct: (id, productData) => {
    if (!id || id === 'undefined') {
      console.error('Invalid product ID for update:', id);
      return Promise.reject(new Error('Invalid product ID'));
    }
    return api.put(`/products/${id}`, productData);
  },
  
  // Delete a product
  deleteProduct: (id) => {
    if (!id || id === 'undefined') {
      console.error('Invalid product ID for deletion:', id);
      return Promise.reject(new Error('Invalid product ID'));
    }
    return api.delete(`/products/${id}`);
  },
  
  // Get products by category
  getProductsByCategory: (category, params = {}) => 
    api.get('/products', { ...params, category }),
};

// Analysis API
export const analysisAPI = {
  // Analyze product from text description
  analyzeProductText: (productText) => 
    api.post('/analysis/analyze-text', { productText }),
  
  // Analyze existing product by ID
  analyzeExistingProduct: (productId, force = false) => {
    if (!productId || productId === 'undefined') {
      console.error('Invalid product ID for analysis:', productId);
      return Promise.reject(new Error('Invalid product ID'));
    }
    return api.post(`/analysis/analyze-product/${productId}`, {}, { params: { force } });
  },
  
  // Get analysis history
  getAnalysisHistory: (page = 1, limit = 10) => 
    api.get('/analysis/history', { page, limit }),
  
  // Get analysis by ID
  getAnalysisById: (id) => {
    if (!id || id === 'undefined') {
      console.error('Invalid analysis ID:', id);
      return Promise.reject(new Error('Invalid analysis ID'));
    }
    return api.get(`/analysis/${id}`);
  },
  
  // Get latest analysis for a product
  getProductAnalysis: (productId) => {
    if (!productId || productId === 'undefined') {
      console.error('Invalid product ID for analysis lookup:', productId);
      return Promise.reject(new Error('Invalid product ID'));
    }
    return api.get(`/analysis/product/${productId}`);
  },
  
  // Compare multiple products
  compareProducts: (productIds, detailed = false) => {
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      console.error('Invalid product IDs for comparison:', productIds);
      return Promise.reject(new Error('Invalid product IDs for comparison'));
    }
    // Filter out any invalid IDs
    const validProductIds = productIds.filter(id => id && id !== 'undefined');
    if (validProductIds.length === 0) {
      return Promise.reject(new Error('No valid product IDs for comparison'));
    }
    return api.post('/analysis/compare', { productIds: validProductIds }, { params: { detailed } });
  },
};

// Guide and content API (for future content management)
export const contentAPI = {
  // Get sustainability tips
  getSustainabilityTips: (category) => 
    api.get('/content/sustainability-tips', { category }),
  
  // Get sustainable materials information
  getMaterialsInfo: () => 
    api.get('/content/materials'),
  
  // Get latest articles or blog posts
  getArticles: (page = 1, limit = 5) => 
    api.get('/content/articles', { page, limit }),
};

const apiServices = {
  products: productAPI,
  analysis: analysisAPI,
  content: contentAPI,
};

export default apiServices;