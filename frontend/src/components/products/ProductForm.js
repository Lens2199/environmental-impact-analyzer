import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Autocomplete,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// Product categories (should ideally come from an API or configuration)
const productCategories = [
  'Electronics',
  'Clothing',
  'Food',
  'Home Goods',
  'Beauty',
  'Automotive',
  'Furniture'
];

// Common materials (should ideally come from an API or configuration)
const commonMaterials = [
  'Aluminum',
  'Plastic',
  'Glass',
  'Steel',
  'Wood',
  'Cotton',
  'Polyester',
  'Paper',
  'Bamboo',
  'Leather',
  'Recycled Plastic',
  'Recycled Aluminum',
  'Recycled Paper',
  'Silicon',
  'Organic Cotton',
  'Plant Extracts',
  'Natural Enzymes',
  'Vegetable Ink'
];

/**
 * Component for adding or editing product information
 */
const ProductForm = ({
  product = null,
  onSubmit,
  onCancel,
  onDelete,
  loading = false,
  error = null,
  elevation = 2
}) => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    materials: [],
    manufacturingLocation: '',
    additionalDetails: '',
    imageUrl: ''
  });
  
  // Form validation errors
  const [errors, setErrors] = useState({});
  
  // Custom material input (for adding new materials)
  const [newMaterial, setNewMaterial] = useState('');
  
  // Initialize form with product data if editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || '',
        materials: product.materials || [],
        manufacturingLocation: product.manufacturingLocation || '',
        additionalDetails: product.additionalDetails || '',
        imageUrl: product.imageUrl || ''
      });
    }
  }, [product]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Handle materials change
  const handleMaterialsChange = (event, newValue) => {
    setFormData({
      ...formData,
      materials: newValue
    });
    
    // Clear validation error when materials are updated
    if (errors.materials) {
      setErrors({
        ...errors,
        materials: null
      });
    }
  };
  
  // Handle adding a custom material
  const handleAddMaterial = () => {
    if (newMaterial && !formData.materials.includes(newMaterial)) {
      setFormData({
        ...formData,
        materials: [...formData.materials, newMaterial]
      });
      setNewMaterial('');
      
      // Clear validation error when materials are updated
      if (errors.materials) {
        setErrors({
          ...errors,
          materials: null
        });
      }
    }
  };
  
  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Product name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Product name must be at least 3 characters';
    }
    
    if (!formData.description || formData.description.trim() === '') {
      newErrors.description = 'Product description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.category || formData.category.trim() === '') {
      newErrors.category = 'Product category is required';
    }
    
    if (!formData.materials || formData.materials.length === 0) {
      newErrors.materials = 'At least one material is required';
    }
    
    if (!formData.manufacturingLocation || formData.manufacturingLocation.trim() === '') {
      newErrors.manufacturingLocation = 'Manufacturing location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        // If editing, include the product ID
        ...(product && { _id: product._id })
      });
    }
  };
  
  return (
    <Paper elevation={elevation} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        {product ? 'Edit Product' : 'Add New Product'}
      </Typography>
      
      <Divider sx={{ mb: 3 }} />
      
      {/* Error display */}
      {error && (
        <Alert 
          severity="error" 
          icon={<ErrorOutlineIcon />}
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Product Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.name}
              helperText={errors.name}
              disabled={loading}
            />
          </Grid>
          
          {/* Category */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.category} required>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category"
                disabled={loading}
              >
                {productCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && (
                <FormHelperText>{errors.category}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          {/* Description */}
          <Grid item xs={12}>
            <TextField
              label="Product Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              required
              multiline
              rows={4}
              error={!!errors.description}
              helperText={errors.description}
              disabled={loading}
              placeholder="Provide a detailed description of the product, including its purpose, key features, and environmental aspects."
            />
          </Grid>
          
          {/* Materials */}
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={commonMaterials}
              value={formData.materials}
              onChange={handleMaterialsChange}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    disabled={loading}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Materials"
                  placeholder="Select materials"
                  error={!!errors.materials}
                  helperText={errors.materials}
                  required
                />
              )}
              disabled={loading}
            />
          </Grid>
          
          {/* Custom Material Input */}
          <Grid item xs={12} sm={8}>
            <TextField
              label="Add Custom Material"
              value={newMaterial}
              onChange={(e) => setNewMaterial(e.target.value)}
              fullWidth
              disabled={loading}
              placeholder="Enter a material not in the list"
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddMaterial}
              disabled={!newMaterial || loading}
              fullWidth
              sx={{ height: '56px' }}
            >
              Add Material
            </Button>
          </Grid>
          
          {/* Manufacturing Location */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Manufacturing Location"
              name="manufacturingLocation"
              value={formData.manufacturingLocation}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.manufacturingLocation}
              helperText={errors.manufacturingLocation}
              disabled={loading}
              placeholder="Country or region of manufacture"
            />
          </Grid>
          
          {/* Image URL */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Product Image URL"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              fullWidth
              disabled={loading}
              placeholder="https://example.com/product-image.jpg"
            />
          </Grid>
          
          {/* Additional Details */}
          <Grid item xs={12}>
            <TextField
              label="Additional Details"
              name="additionalDetails"
              value={formData.additionalDetails}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              disabled={loading}
              placeholder="Additional information such as certifications, sustainability features, or manufacturing processes"
            />
          </Grid>
          
          {/* Form Actions */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              {onCancel && (
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<CancelIcon />}
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              )}
              
              {product && onDelete && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this product?')) {
                      onDelete(product._id);
                    }
                  }}
                  disabled={loading}
                >
                  Delete
                </Button>
              )}
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={loading}
              >
                {loading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

ProductForm.propTypes = {
  /** Product data for editing (null for new product) */
  product: PropTypes.object,
  /** Function to handle form submission */
  onSubmit: PropTypes.func.isRequired,
  /** Function to handle cancellation */
  onCancel: PropTypes.func,
  /** Function to handle deletion */
  onDelete: PropTypes.func,
  /** Whether the form is in a loading state */
  loading: PropTypes.bool,
  /** Error message to display */
  error: PropTypes.string,
  /** Paper elevation */
  elevation: PropTypes.number
};

export default ProductForm;