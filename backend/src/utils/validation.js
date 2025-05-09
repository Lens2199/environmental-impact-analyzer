/**
 * Validation utilities for API requests
 */

/**
 * Validate product input data
 * @param {Object} productData - The product data to validate
 * @returns {Object} Validation result with error messages if any
 */
const validateProduct = (productData) => {
    const errors = {};
    
    // Name validation
    if (!productData.name) {
      errors.name = 'Product name is required';
    } else if (productData.name.length < 3) {
      errors.name = 'Product name must be at least 3 characters long';
    } else if (productData.name.length > 100) {
      errors.name = 'Product name must be less than 100 characters';
    }
    
    // Description validation
    if (!productData.description) {
      errors.description = 'Product description is required';
    } else if (productData.description.length < 10) {
      errors.description = 'Product description must be at least 10 characters long';
    }
    
    // Category validation
    if (!productData.category) {
      errors.category = 'Product category is required';
    }
    
    // Materials validation
    if (!productData.materials || !Array.isArray(productData.materials) || productData.materials.length === 0) {
      errors.materials = 'At least one material must be specified';
    }
    
    // Manufacturing location validation
    if (!productData.manufacturingLocation) {
      errors.manufacturingLocation = 'Manufacturing location is required';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  /**
   * Validate product analysis input data
   * @param {Object} analysisData - The analysis data to validate
   * @returns {Object} Validation result with error messages if any
   */
  const validateAnalysisInput = (analysisData) => {
    const errors = {};
    
    // Product text validation
    if (!analysisData.productText) {
      errors.productText = 'Product description text is required';
    } else if (analysisData.productText.length < 10) {
      errors.productText = 'Product description must be at least 10 characters long';
    } else if (analysisData.productText.length > 2000) {
      errors.productText = 'Product description must be less than 2000 characters';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  /**
   * Validate product comparison input data
   * @param {Object} comparisonData - The comparison data to validate
   * @returns {Object} Validation result with error messages if any
   */
  const validateComparisonInput = (comparisonData) => {
    const errors = {};
    
    // Product IDs validation
    if (!comparisonData.productIds) {
      errors.productIds = 'Product IDs are required';
    } else if (!Array.isArray(comparisonData.productIds)) {
      errors.productIds = 'Product IDs must be an array';
    } else if (comparisonData.productIds.length < 2) {
      errors.productIds = 'At least two product IDs are required for comparison';
    } else if (comparisonData.productIds.length > 3) {
      errors.productIds = 'Maximum 3 products can be compared at once';
    } else {
      const uniqueIds = new Set(comparisonData.productIds);
      if (uniqueIds.size !== comparisonData.productIds.length) {
        errors.productIds = 'Duplicate product IDs are not allowed';
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  /**
   * Create a middleware function for validating request data
   * @param {Function} validationFunction - The validation function to use
   * @param {String} dataField - The field in the request body containing the data to validate
   * @returns {Function} Express middleware function
   */
  const validateRequest = (validationFunction, dataField = null) => {
    return (req, res, next) => {
      const dataToValidate = dataField ? req.body[dataField] : req.body;
      const { isValid, errors } = validationFunction(dataToValidate);
      
      if (!isValid) {
        return res.status(400).json({ message: 'Validation failed', errors });
      }
      
      next();
    };
  };
  
  module.exports = {
    validateProduct,
    validateAnalysisInput,
    validateComparisonInput,
    validateRequest
  };