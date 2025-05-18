/**
 * Product model for Supabase
 * Handles interactions with the 'products' table
 */
const { supabase } = require('../config/database');

// Mock products for development mode
const mockProducts = [
  {
    id: '1',
    name: 'Eco-Friendly Smartphone',
    category: 'Electronics',
    description: 'Made with recycled materials and designed for easy repair and recycling at end of life.',
    materials: ['Recycled Aluminum', 'Recycled Plastic', 'Glass'],
    manufacturing_location: 'Germany',
    image_url: '/assets/pic/Eco-Friendly Smartphone.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    environmental_score: 85
  },
  {
    id: '2',
    name: 'Organic Cotton T-Shirt',
    category: 'Clothing',
    description: 'Made with 100% organic cotton grown without harmful pesticides or synthetic fertilizers.',
    materials: ['Organic Cotton'],
    manufacturing_location: 'Portugal',
    image_url: '/assets/pic/Organic Cotton T-Shirt.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    environmental_score: 92
  },
  {
    id: '3',
    name: 'Bamboo Kitchen Utensils',
    category: 'Home Goods',
    description: 'Sustainable bamboo kitchen utensils that are biodegradable and renewable.',
    materials: ['Bamboo'],
    manufacturing_location: 'Vietnam',
    image_url: '/assets/pic/Bamboo Kitchen Utensils.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    environmental_score: 88
  },
  {
    id: '4',
    name: 'Solar-Powered Power Bank',
    category: 'Electronics',
    description: 'Charge your devices using clean solar energy. Includes recycled components.',
    materials: ['Recycled Plastic', 'Silicon', 'Lithium Battery'],
    manufacturing_location: 'China',
    image_url: '/assets/pic/Solar-Powered Power Bank.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    environmental_score: 79
  },
  {
    id: '5',
    name: 'Plant-Based Laundry Detergent',
    category: 'Home Goods',
    description: 'Biodegradable laundry detergent made from plant-derived ingredients.',
    materials: ['Plant Extracts', 'Natural Enzymes'],
    manufacturing_location: 'USA',
    image_url: '/assets/pic/Plant-Based Laundry Detergent.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    environmental_score: 95
  },
  {
    id: '6',
    name: 'Recycled Paper Notebook',
    category: 'Home Goods',
    description: '100% recycled paper notebook with vegetable-based ink printing.',
    materials: ['Recycled Paper', 'Vegetable Ink'],
    manufacturing_location: 'Canada',
    image_url: '/assets/pic/Recycled Paper Notebook.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    environmental_score: 90
  }
];

/**
 * Helper to determine if we should use mock data
 * @returns {boolean} - True if mock data should be used
 */
const shouldUseMockData = () => {
  return process.env.NODE_ENV === 'development' && 
         (process.env.REACT_APP_USE_MOCK_DATA === 'true' || 
          process.env.USE_MOCK_DATA === 'true');
};

/**
 * Get a mock product by ID
 * @param {string} id - Product ID (numeric)
 * @returns {Object} - Mock product data
 */
const getMockProductById = (id) => {
  // Convert ID to string for comparison
  const stringId = String(id);
  const mockProduct = mockProducts.find(p => p.id === stringId);
  
  if (!mockProduct) {
    throw new Error('Product not found');
  }
  
  return mockProduct;
};

/**
 * Get mock products with filtering options
 * @param {Object} options - Filter options
 * @returns {Object} - Filtered products and pagination data
 */
const getMockProducts = (options = {}) => {
  const {
    page = 1,
    limit = 10,
    category,
    search,
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = options;

  let filtered = [...mockProducts];
  
  // Apply category filter
  if (category && category !== 'All Categories') {
    filtered = filtered.filter(p => p.category === category);
  }
  
  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchLower) || 
      p.description.toLowerCase().includes(searchLower) || 
      (p.materials && p.materials.some(m => m.toLowerCase().includes(searchLower)))
    );
  }
  
  // Apply sorting
  filtered.sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'created_at') {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });
  
  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedResults = filtered.slice(startIndex, endIndex);
  
  return {
    products: paginatedResults,
    total: filtered.length,
    page,
    pages: Math.ceil(filtered.length / limit)
  };
};

/**
 * Get all products with optional pagination and filtering
 * @param {Object} options - Query options
 * @returns {Promise<Object>} - Products data and count
 */
const getAllProducts = async (options = {}) => {
  // Use mock data in development mode
  if (shouldUseMockData()) {
    console.log('Using mock product data');
    return getMockProducts(options);
  }

  const {
    page = 1,
    limit = 10,
    category,
    search,
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = options;

  // Calculate pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Start building query
  let query = supabase
    .from('products')
    .select('*', { count: 'exact' });

  // Apply category filter if provided
  if (category && category !== 'All Categories') {
    query = query.eq('category', category);
  }

  // Apply search filter if provided
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  // Apply pagination
  query = query.range(from, to);

  // Execute query
  const { data, error, count } = await query;

  if (error) {
    console.error('Database error:', error);
    // Fall back to mock data on error in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('Falling back to mock data after database error');
      return getMockProducts(options);
    }
    throw new Error(`Error fetching products: ${error.message}`);
  }

  return {
    products: data,
    total: count,
    page,
    pages: Math.ceil(count / limit)
  };
};

/**
 * Get a product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} - Product data
 */
const getProductById = async (id) => {
  // Use mock data in development mode
  if (shouldUseMockData()) {
    console.log(`Using mock data for product ID: ${id}`);
    return getMockProductById(id);
  }
  
  try {
    // For UUID formatted IDs, use standard query
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Product not found');
      }
      throw new Error(`Error fetching product: ${error.message}`);
    }

    return data;
  } catch (error) {
    // If the error is related to UUID format and we're in development
    if (process.env.NODE_ENV === 'development' && 
        error.message && 
        error.message.includes('invalid input syntax for type uuid')) {
      console.log(`UUID format error, falling back to mock data for ID: ${id}`);
      // Fall back to mock data
      return getMockProductById(id);
    }
    
    // Otherwise, throw the original error
    throw error;
  }
};

/**
 * Search products by query string
 * @param {string} query - Search term
 * @returns {Promise<Array>} - Matching products
 */
const searchProducts = async (query) => {
  // Use mock data in development mode
  if (shouldUseMockData()) {
    console.log(`Using mock data for search: ${query}`);
    const results = getMockProducts({ search: query });
    return results.products;
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`);

  if (error) {
    console.error('Search error:', error);
    // Fall back to mock data on error in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Falling back to mock data after search error');
      const results = getMockProducts({ search: query });
      return results.products;
    }
    throw new Error(`Error searching products: ${error.message}`);
  }

  return data;
};

/**
 * Get products by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} - Products in category
 */
const getProductsByCategory = async (category) => {
  // Use mock data in development mode
  if (shouldUseMockData()) {
    console.log(`Using mock data for category: ${category}`);
    const results = getMockProducts({ category });
    return results.products;
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category);

  if (error) {
    console.error('Category fetch error:', error);
    // Fall back to mock data on error in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Falling back to mock data after category fetch error');
      const results = getMockProducts({ category });
      return results.products;
    }
    throw new Error(`Error fetching products by category: ${error.message}`);
  }

  return data;
};

/**
 * Create a new product
 * @param {Object} productData - Product data
 * @returns {Promise<Object>} - Created product
 */
const createProduct = async (productData) => {
  // Transform data if needed
  const product = {
    name: productData.name,
    description: productData.description,
    category: productData.category,
    materials: productData.materials || [],
    manufacturing_location: productData.manufacturingLocation,
    additional_details: productData.additionalDetails,
    image_url: productData.imageUrl
  };

  // Use mock data in development mode (just return the data)
  if (shouldUseMockData()) {
    console.log('Mock product creation');
    // Generate a new ID by taking the max ID in mock products and adding 1
    const newId = String(Math.max(...mockProducts.map(p => parseInt(p.id))) + 1);
    const mockProduct = {
      id: newId,
      ...product,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    // Add to mock products array (in memory only)
    mockProducts.push(mockProduct);
    return mockProduct;
  }

  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select();

  if (error) {
    throw new Error(`Error creating product: ${error.message}`);
  }

  return data[0];
};

/**
 * Update a product
 * @param {string} id - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise<Object>} - Updated product
 */
const updateProduct = async (id, productData) => {
  // Transform data if needed
  const product = {};
  
  if (productData.name) product.name = productData.name;
  if (productData.description) product.description = productData.description;
  if (productData.category) product.category = productData.category;
  if (productData.materials) product.materials = productData.materials;
  if (productData.manufacturingLocation) product.manufacturing_location = productData.manufacturingLocation;
  if (productData.additionalDetails) product.additional_details = productData.additionalDetails;
  if (productData.imageUrl) product.image_url = productData.imageUrl;
  
  // Add updated_at timestamp
  product.updated_at = new Date().toISOString();

  // Use mock data in development mode
  if (shouldUseMockData()) {
    console.log(`Mock product update for ID: ${id}`);
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    // Update the product in mock data
    mockProducts[index] = { ...mockProducts[index], ...product };
    return mockProducts[index];
  }

  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select();

  if (error) {
    throw new Error(`Error updating product: ${error.message}`);
  }

  if (data.length === 0) {
    throw new Error('Product not found');
  }

  return data[0];
};

/**
 * Delete a product
 * @param {string} id - Product ID
 * @returns {Promise<boolean>} - Success status
 */
const deleteProduct = async (id) => {
  // Use mock data in development mode
  if (shouldUseMockData()) {
    console.log(`Mock product deletion for ID: ${id}`);
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    // Remove from mock array
    mockProducts.splice(index, 1);
    return true;
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Error deleting product: ${error.message}`);
  }

  return true;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory
};