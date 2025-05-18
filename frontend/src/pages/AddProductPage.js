import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Alert
} from '@mui/material';
import { Link } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ProductForm from '../components/products/ProductForm';
import LoadingState from '../components/common/LoadingState';
import { productAPI } from '../services/api';

/**
 * Page for adding a new product
 */
function AddProductPage() {
  const navigate = useNavigate();
  
  // State for loading and error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Handle form submission
  const handleSubmit = async (productData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // API call to create product
      const response = await productAPI.createProduct(productData);
      
      setSuccess(true);
      setLoading(false);
      
      // Navigate to the product detail page after a short delay
      setTimeout(() => {
        navigate(`/products/${response.data._id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle cancellation - go back to products page
  const handleCancel = () => {
    navigate('/search');
  };
  
  return (
    <Box className="page-transition">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
          aria-label="breadcrumb"
          sx={{ mb: 3 }}
        >
          <MuiLink component={Link} to="/" color="inherit">
            Home
          </MuiLink>
          <MuiLink component={Link} to="/search" color="inherit">
            Products
          </MuiLink>
          <Typography color="text.primary">Add New Product</Typography>
        </Breadcrumbs>
        
        {/* Page Title */}
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ mb: 4 }}
        >
          Add New Product
        </Typography>
        
        {/* Success Message */}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Product created successfully! Redirecting to product page...
          </Alert>
        )}
        
        {/* Loading State */}
        {loading ? (
          <LoadingState
            message="Creating product..."
            size="medium"
            fullPage={false}
            padding={6}
          />
        ) : (
          // Product Form
          <ProductForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
            error={error}
            elevation={2}
          />
        )}
        
        {/* Information Box */}
        <Box
          sx={{
            mt: 4,
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Tips for Adding Products
          </Typography>
          <Typography variant="body2" paragraph>
            • <strong>Be specific:</strong> Provide detailed information about materials, manufacturing processes, and other relevant details.
          </Typography>
          <Typography variant="body2" paragraph>
            • <strong>Include environmental features:</strong> Mention any eco-friendly attributes, certifications, or sustainable practices.
          </Typography>
          <Typography variant="body2" paragraph>
            • <strong>Be accurate:</strong> Ensure all information is accurate for the best environmental impact analysis.
          </Typography>
          <Typography variant="body2">
            • <strong>Adding an image URL:</strong> Provide a direct URL to an image of the product for better visualization.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default AddProductPage;