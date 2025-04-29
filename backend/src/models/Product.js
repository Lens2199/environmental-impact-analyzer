/**
 * Product model for Supabase
 * Handles interactions with the 'products' table
 */
const { supabase } = require('../config/database');

/**
 * Get all products with optional pagination and filtering
 * 
 * @param {Object} options - Query options
 * @param {number} options.page - Page number for pagination
 * @param {number} options.limit - Number of items per page
 * @param {string} options.category - Filter by category
 * @param {string} options.search - Search term for filtering
 * @returns {Promise<Object>} - Products data and count
 */
const getAllProducts = async (options = {}) => {
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
 * 
 * @param {string} id - Product ID
 * @returns {Promise<Object>} - Product data
 */
const getProductById = async (id) => {
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
  product.updated_at = new Date();

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
 * 
 * @param {string} id - Product ID
 * @returns {Promise<boolean>} - Success status
 */
const deleteProduct = async (id) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Error deleting product: ${error.message}`);
  }

  return true;
};

/**
 * Search products by query string
 * 
 * @param {string} query - Search term
 * @returns {Promise<Array>} - Matching products
 */
const searchProducts = async (query) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`);

  if (error) {
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
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category);

  if (error) {
    throw new Error(`Error fetching products by category: ${error.message}`);
  }

  return data;
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