// Import Product model (adapted for Supabase)
const Product = require('../models/Product');

/**
 * Get all products with pagination and filtering
 * @route GET /api/products
 */
exports.getAllProducts = async (req, res, next) => {
  try {
    const { page, limit, category, search, sortBy, sortOrder } = req.query;
    
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      category,
      search,
      sortBy: sortBy || 'created_at',
      sortOrder: sortOrder || 'desc'
    };
    
    const result = await Product.getAllProducts(options);
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get product by ID
 * @route GET /api/products/:id
 */
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.getProductById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    if (error.message === 'Product not found') {
      return res.status(404).json({ message: 'Product not found' });
    }
    next(error);
  }
};

/**
 * Create new product
 * @route POST /api/products
 */
exports.createProduct = async (req, res, next) => {
  try {
    // Transform camelCase to snake_case if needed
    const productData = {
      ...req.body,
      manufacturingLocation: req.body.manufacturingLocation,
      additionalDetails: req.body.additionalDetails,
      imageUrl: req.body.imageUrl
    };
    
    const product = await Product.createProduct(productData);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

/**
 * Update product
 * @route PUT /api/products/:id
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.updateProduct(req.params.id, req.body);
    res.status(200).json(product);
  } catch (error) {
    if (error.message === 'Product not found') {
      return res.status(404).json({ message: 'Product not found' });
    }
    next(error);
  }
};

/**
 * Delete product
 * @route DELETE /api/products/:id
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.deleteProduct(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Search products
 * @route GET /api/products/search/:query
 */
exports.searchProducts = async (req, res, next) => {
  try {
    const products = await Product.searchProducts(req.params.query);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

/**
 * Get products by category
 * @route GET /api/products/category/:category
 */
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const products = await Product.getProductsByCategory(req.params.category);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};