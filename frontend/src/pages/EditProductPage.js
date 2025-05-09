import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Alert,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProductForm from '../components/products/ProductForm';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import { productAPI } from '../services/api';

/**
 * Page for editing an existing product
 */
function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State for product data
  const [product, setProduct] = useState(null);
  
  // State for loading and error
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productAPI.getProductById(id);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setFetchError(err.response?.data?.message || 'Failed to load product data.');
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  // Handle form submission for updating the product
  const handleSubmit = async (updatedProductData) => {
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    
    try {
      // API call to update product
      await productAPI.updateProduct(id, updatedProductData);
      
      setSuccess(true);
      setSubmitting(false);
      
      // Navigate back to the product detail page after a short delay
      setTimeout(() => {
        navigate(`/products/${id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product. Please try again.');
      setSubmitting(false);
    }
  };
  
  // Handle product deletion
  const handleDelete = async () => {
    setSubmitting(true);
    setError(null);
    
    try {
      // API call to delete product
      await productAPI.deleteProduct(id);
      
      // Close the dialog
      setDeleteDialogOpen(false);
      
      // Navigate back to products page after a short delay
      setTimeout(() => {
        navigate('/search', { state: { message: 'Product deleted successfully' } });
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product. Please try again.');
      setSubmitting(false);
      setDeleteDialogOpen(false);
    }
  };
  
  // Handle cancellation - go back to product detail page
  const handleCancel = () => {
    navigate(`/products/${id}`);
  };
  
  // Show loading state while fetching product data
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <LoadingState 
          message="Loading product data..." 
          fullPage={true}
        />
      </Container>
    );
  }
  
  // Show error state if product fetch failed
  if (fetchError) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <ErrorState
          error={fetchError}
          fullPage={true}
          onRetry={() => window.location.reload()}
        />
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/search')}
          >
            Back to Products
          </Button>
        </Box>
      </Container>
    );
  }
  
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
          <MuiLink component={Link} to={`/products/${id}`} color="inherit">
            {product?.name || 'Product Details'}
          </MuiLink>
          <Typography color="text.primary">Edit</Typography>
        </Breadcrumbs>
        
        {/* Page Title */}
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ mb: 4 }}
        >
          Edit Product: {product?.name}
        </Typography>
        
        {/* Success Message */}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Product updated successfully! Redirecting to product page...
          </Alert>
        )}
        
        {/* Product Form */}
        <ProductForm
          product={product}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onDelete={() => setDeleteDialogOpen(true)}
          loading={submitting}
          error={error}
          elevation={2}
        />
        
        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          open={deleteDialogOpen}
          title="Delete Product"
          message={`Are you sure you want to delete "${product?.name}"? This action cannot be undone.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          confirmColor="error"
          type="warning"
          onConfirm={handleDelete}
          onCancel={() => setDeleteDialogOpen(false)}
        />
      </Container>
    </Box>
  );
}

export default EditProductPage;