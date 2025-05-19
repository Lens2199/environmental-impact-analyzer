/**
 * Product model for Supabase
 * Handles interactions with the 'products' table
 */
const { supabase } = require('../config/database');

// Mock products with both numeric IDs and UUIDs
const mockProducts = [
  {
    id: '1',
    uuid: '123e4567-e89b-12d3-a456-426614174001',
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
    uuid: '123e4567-e89b-12d3-a456-426614174002',
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
    uuid: '123e4567-e89b-12d3-a456-426614174003',
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
    uuid: '123e4567-e89b-12d3-a456-426614174004',
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
    uuid: '123e4567-e89b-12d3-a456-426614174005',
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
    uuid: '123e4567-e89b-12d3-a456-426614174006',
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
 * Helper to check if a string is a valid UUID
 * @param {string} str - String to check
 * @returns {boolean} - True if valid UUID
 */
const isUUID = (str) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

/**
 * Helper to check if string is a numeric ID
 * @param {string} str - String to check
 * @returns {boolean} - True if numeric ID
 */
const isNumericId = (str) => {
  return /^\d+$/.test(str);
};

/**
 * Helper to determine if we should use mock data
 * @returns {boolean} - True if mock data should be used
 */
const shouldUseMockData = () => {
  return process.env.NODE_ENV === 'development' && 
         (process.env.SEED_DB === 'true' || 
          process.env.USE_MOCK_DATA === 'true');
};

/**
 * Get a product by ID (either UUID or numeric ID)
 * 
 * @param {string} id - Product ID (UUID or numeric)
 * @returns {Promise<Object>} - Product data
 */
const getProductById = async (id) => {
  // Always check for mock data first in development
  if (shouldUseMockData()) {
    console.log(`Using mock data for product ID: ${id}`);
    const mockProduct = mockProducts.find(p => p.id === id || p.uuid === id);
    if (mockProduct) {
      return mockProduct;
    }
  }
  
  try {
    let query;
    
    // Check if the ID is a valid UUID
    if (isUUID(id)) {
      // Use standard query with UUID
      query = supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
    } 
    // Check if the ID is a numeric string
    else if (isNumericId(id)) {
      console.log(`Using numeric ID query for: ${id}`);
      
      // First try to find by legacy_id if that column exists
      query = supabase
        .from('products')
        .select('*')
        .eq('legacy_id', id)
        .single();
        
      const { data, error } = await query;
      
      // If legacy_id doesn't exist or no product found, try matching UUID that ends with that number
      if (error || !data) {
        console.log(`No product found with legacy_id: ${id}, trying UUID lookup`);
        // Try a wildcard search for UUIDs ending with the ID padded to length 12
        const paddedId = id.padStart(12, '0');
        query = supabase
          .from('products')
          .select('*')
          .ilike('id', `%${paddedId}`)
          .single();
      } else {
        return data;
      }
    } else {
      throw new Error('Invalid product ID format');
    }

    // Execute the query
    const { data, error } = await query;

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Product not found');
      }
      throw new Error(`Error fetching product: ${error.message}`);
    }

    // If still in development and no product found, use mock data
    if (!data && shouldUseMockData()) {
      console.log(`No product found in database, using mock for ID: ${id}`);
      const mockProduct = mockProducts.find(p => p.id === id);
      if (mockProduct) {
        return mockProduct;
      }
    }

    return data;
  } catch (error) {
    // In development, fall back to mock data if there's an error
    if (shouldUseMockData()) {
      console.log(`Error in database query, using mock for ID: ${id}`);
      const mockProduct = mockProducts.find(p => p.id === id);
      if (mockProduct) {
        return mockProduct;
      }
    }
    
    // If we still haven't found a product, throw the error
    throw error;
  }
};

/**
 * Get all products with optional pagination and filtering
 * 
 * @param {Object} options - Query options
 * @returns {Promise<Object>} - Products data and count
 */
const getAllProducts = async (options = {}) => {
  // Use mock data in development mode
  if (shouldUseMockData()) {
    console.log('Using mock product data');
    
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
  }

  // Real database query
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
    if (shouldUseMockData()) {
      console.log('Falling back to mock data after database error');
      return getMockProducts(options);
    }
    throw new Error(`Error fetching products: ${error.message}`);
  }

  // If we get empty results and we're in development, use mock data as fallback
  if ((!data || data.length === 0) && shouldUseMockData()) {
    console.log('No results from database, using mock data');
    return getMockProducts(options);
  }

  return {
    products: data,
    total: count,
    page,
    pages: Math.ceil(count / limit)
  };
};

/**
 * Get mock products with filtering options (internal helper function)
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
 * Search products by query string
 * 
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
 * 
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
 * 
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

  // Add a legacy_id if we're using numeric IDs
  if (productData.id && isNumericId(productData.id)) {
    product.legacy_id = productData.id;
  }

  // Use mock data in development mode (just return the data)
  if (shouldUseMockData()) {
    console.log('Mock product creation');
    // Generate a new ID by taking the max ID in mock products and adding 1
    const newId = String(Math.max(...mockProducts.map(p => parseInt(p.id))) + 1);
    const mockProduct = {
      id: newId,
      uuid: `123e4567-e89b-12d3-a456-42661417400${newId}`, // Create a fake UUID
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
 * 
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
    let index;
    
    // Find product by UUID or numeric ID
    if (isUUID(id)) {
      index = mockProducts.findIndex(p => p.uuid === id);
    } else {
      index = mockProducts.findIndex(p => p.id === id);
    }
    
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    // Update the product in mock data
    mockProducts[index] = { ...mockProducts[index], ...product };
    return mockProducts[index];
  }

  // Handle both UUID and numeric ID
  let query;
  
  if (isUUID(id)) {
    query = supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select();
  } else if (isNumericId(id)) {
    query = supabase
      .from('products')
      .update(product)
      .eq('legacy_id', id)
      .select();
      
    const { data, error } = await query;
    
    if (error || !data || data.length === 0) {
      // Try with wildcard UUID
      const paddedId = id.padStart(12, '0');
      query = supabase
        .from('products')
        .update(product)
        .ilike('id', `%${paddedId}`)
        .select();
    } else {
      return data[0];
    }
  } else {
    throw new Error('Invalid product ID format');
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error updating product: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error('Product not found');
  }

  return data[0];
};

/**
 * Delete a product
 * 
 * @param {string} id - Product ID
 * @returns {Promise<boolean>} - Success status
 */
const deleteProduct = async (id) => {
  // Use mock data in development mode
  if (shouldUseMockData()) {
    console.log(`Mock product deletion for ID: ${id}`);
    let index;
    
    // Find product by UUID or numeric ID
    if (isUUID(id)) {
      index = mockProducts.findIndex(p => p.uuid === id);
    } else {
      index = mockProducts.findIndex(p => p.id === id);
    }
    
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    // Remove from mock array
    mockProducts.splice(index, 1);
    return true;
  }

  // Handle both UUID and numeric ID
  let query;
  
  if (isUUID(id)) {
    query = supabase
      .from('products')
      .delete()
      .eq('id', id);
  } else if (isNumericId(id)) {
    query = supabase
      .from('products')
      .delete()
      .eq('legacy_id', id);
      
    const { error } = await query;
    
    if (error) {
      // Try with wildcard UUID
      const paddedId = id.padStart(12, '0');
      query = supabase
        .from('products')
        .delete()
        .ilike('id', `%${paddedId}`);
    } else {
      return true;
    }
  } else {
    throw new Error('Invalid product ID format');
  }

  const { error } = await query;

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