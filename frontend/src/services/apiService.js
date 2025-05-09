import axios from 'axios';

/**
 * Enhanced API service with interceptors and error handling
 */

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization header if needed (for future authentication)
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in development environment
    if (process.env.NODE_ENV !== 'production') {
      console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
      if (config.data) {
        console.log('Request Data:', config.data);
      }
    }
    
    return config;
  },
  (error) => {
    // Handle request errors
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log responses in development environment
    if (process.env.NODE_ENV !== 'production') {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    
    return response;
  },
  (error) => {
    // Handle response errors
    const { response } = error;
    
    // Log error details
    console.error('API Response Error:', error);
    
    if (response) {
      // Handle specific status codes
      switch (response.status) {
        case 401:
          // Unauthorized - Handle token expiration or login issues
          console.error('Authentication error - Please log in again');
          // Clear auth token
          localStorage.removeItem('authToken');
          // In a real app, redirect to login page
          break;
          
        case 403:
          // Forbidden - User doesn't have permission
          console.error('Authorization error - Access denied');
          break;
          
        case 404:
          // Not found
          console.error(`Resource not found: ${response.config.url}`);
          break;
          
        case 422:
          // Validation error
          console.error('Validation error:', response.data?.errors || 'Invalid data');
          break;
          
        case 500:
          // Server error
          console.error('Server error:', response.data?.message || 'Internal server error');
          break;
          
        default:
          // Other errors
          console.error(`Error ${response.status}:`, response.data?.message || 'Unknown error');
      }
      
      // Return a formatted error for consistent handling
      return Promise.reject({
        status: response.status,
        message: response.data?.message || 'An error occurred',
        errors: response.data?.errors,
        data: response.data
      });
    }
    
    // Handle network errors (no response from server)
    if (error.request) {
      console.error('Network Error - No response from server');
      return Promise.reject({
        status: 0,
        message: 'Network error - Unable to connect to server',
        isNetworkError: true
      });
    }
    
    // Handle other errors
    return Promise.reject({
      message: error.message || 'An unexpected error occurred',
      isUnexpectedError: true
    });
  }
);

// Helper functions for common request methods
const api = {
  /**
   * Perform a GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @param {Object} options - Additional axios options
   * @returns {Promise} Promise that resolves with response data
   */
  get: async (endpoint, params = {}, options = {}) => {
    try {
      const response = await apiClient.get(endpoint, {
        params,
        ...options
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Perform a POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Additional axios options
   * @returns {Promise} Promise that resolves with response data
   */
  post: async (endpoint, data = {}, options = {}) => {
    try {
      const response = await apiClient.post(endpoint, data, options);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Perform a PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Additional axios options
   * @returns {Promise} Promise that resolves with response data
   */
  put: async (endpoint, data = {}, options = {}) => {
    try {
      const response = await apiClient.put(endpoint, data, options);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Perform a PATCH request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Additional axios options
   * @returns {Promise} Promise that resolves with response data
   */
  patch: async (endpoint, data = {}, options = {}) => {
    try {
      const response = await apiClient.patch(endpoint, data, options);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Perform a DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional axios options
   * @returns {Promise} Promise that resolves with response data
   */
  delete: async (endpoint, options = {}) => {
    try {
      const response = await apiClient.delete(endpoint, options);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default api;