const express = require('express');
const router = express.Router();

// Import controller (to be created)
const productController = require('../controllers/productController');

// Routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Search products
router.get('/search/:query', productController.searchProducts);

module.exports = router;