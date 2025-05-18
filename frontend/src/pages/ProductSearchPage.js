import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EcoIcon from '../components/icons/EcoIcon';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import InfoIcon from '@mui/icons-material/Info';
import RefreshIcon from '@mui/icons-material/Refresh';

// Import images directly from src/assets/pic/
import ecoPhoneImage from '../assets/pic/Eco-Friendly Smartphone.jpg';
import organicShirtImage from '../assets/pic/Organic Cotton T-Shirt.jpg';
import bambooUtensilsImage from '../assets/pic/Bamboo Kitchen Utensils.jpg';
import solarPowerBankImage from '../assets/pic/Solar-Powered Power Bank.jpg';
import ecoDetergentImage from '../assets/pic/Plant-Based Laundry Detergent.jpg';
import recycledNotebookImage from '../assets/pic/Recycled Paper Notebook.jpg';

// Import the API service
import { productAPI } from '../services/api';

// Import the global context
import { useAppContext } from '../context/AppContext';

// Define product categories for filtering
const productCategories = [
  'All Categories',
  'Electronics',
  'Clothing',
  'Food',
  'Home Goods',
  'Beauty',
  'Automotive',
  'Furniture'
];

// Helper function to get product ID (handle both _id and id fields)
const getProductId = (product) => {
  if (!product) return null;
  return product._id || product.id || null;
};

// Generate colorful rectangles as fallback if images fail to load
const generateColorfulPlaceholder = (productName) => {
  // Generate a color based on the product name (for consistent colors per product)
  const getColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
  };
  
  // Calculate brightness to determine if text should be black or white
  const getBrightness = (hexColor) => {
    // Remove the # if present
    hexColor = hexColor.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    
    // Calculate brightness (HSP formula)
    return Math.sqrt(
      0.299 * (r * r) +
      0.587 * (g * g) +
      0.114 * (b * b)
    );
  };
  
  // Create an SVG rectangle with the product name
  const color = getColor(productName);
  const textColor = getBrightness(color) > 160 ? '#000000' : '#FFFFFF';
  
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
      <rect width="300" height="200" fill="${color}" />
      <text x="150" y="100" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="${textColor}">${productName}</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svgContent)}`;
};

function ProductSearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Get selected products from global context
  const { selectedProducts, toggleProductSelection, clearSelectedProducts } = useAppContext();
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState(queryParams.get('q') || '');
  const [category, setCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('latest');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Mock initial products with imported images
  const initialProducts = useMemo(() => [
    {
      id: '1',
      name: 'Eco-Friendly Smartphone',
      category: 'Electronics',
      description: 'Made with recycled materials and designed for easy repair and recycling at end of life.',
      materials: ['Recycled Aluminum', 'Recycled Plastic', 'Glass'],
      manufacturingLocation: 'Germany',
      imageUrl: ecoPhoneImage // Use imported image
    },
    {
      id: '2',
      name: 'Organic Cotton T-Shirt',
      category: 'Clothing',
      description: 'Made with 100% organic cotton grown without harmful pesticides or synthetic fertilizers.',
      materials: ['Organic Cotton'],
      manufacturingLocation: 'Portugal',
      imageUrl: organicShirtImage // Use imported image
    },
    {
      id: '3',
      name: 'Bamboo Kitchen Utensils',
      category: 'Home Goods',
      description: 'Sustainable bamboo kitchen utensils that are biodegradable and renewable.',
      materials: ['Bamboo'],
      manufacturingLocation: 'Vietnam',
      imageUrl: bambooUtensilsImage // Use imported image
    },
    {
      id: '4',
      name: 'Solar-Powered Power Bank',
      category: 'Electronics',
      description: 'Charge your devices using clean solar energy. Includes recycled components.',
      materials: ['Recycled Plastic', 'Silicon', 'Lithium Battery'],
      manufacturingLocation: 'China',
      imageUrl: solarPowerBankImage // Use imported image
    },
    {
      id: '5',
      name: 'Plant-Based Laundry Detergent',
      category: 'Home Goods',
      description: 'Biodegradable laundry detergent made from plant-derived ingredients.',
      materials: ['Plant Extracts', 'Natural Enzymes'],
      manufacturingLocation: 'USA',
      imageUrl: ecoDetergentImage // Use imported image
    },
    {
      id: '6',
      name: 'Recycled Paper Notebook',
      category: 'Home Goods',
      description: '100% recycled paper notebook with vegetable-based ink printing.',
      materials: ['Recycled Paper', 'Vegetable Ink'],
      manufacturingLocation: 'Canada',
      imageUrl: recycledNotebookImage // Use imported image
    }
  ], []); // Empty dependency array means this won't change
  
  // Function to get sort parameter based on selected option
  const getSortParam = (sortOption) => {
    switch (sortOption) {
      case 'latest':
        return 'createdAt:desc';
      case 'name_asc':
        return 'name:asc';
      case 'name_desc':
        return 'name:desc';
      default:
        return 'createdAt:desc';
    }
  };
  
  // Debug function to log current selected products
  const logSelectionState = () => {
    console.log('Current selected products:', selectedProducts);
    console.log('Sample image src type:', typeof initialProducts[0].imageUrl);
  };
  
  // Debug product structure
  useEffect(() => {
    if (products.length > 0) {
      console.log('Sample product structure:', products[0]);
    }
  }, [products]);
  
  // Function to fetch products from API - wrapped in useCallback to prevent recreation on every render
  const fetchProducts = useCallback(async () => {
    // For initial development/testing, use the mock data
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true' || true) { // Force using mock data for now
      let filteredProducts = [...initialProducts];
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(query) || 
          p.description.toLowerCase().includes(query) ||
          p.materials.some(m => m.toLowerCase().includes(query))
        );
      }
      
      // Apply category filter
      if (category !== 'All Categories') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
      }
      
      // Apply sorting
      if (sortBy === 'name_asc') {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === 'name_desc') {
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
      }
      
      // Ensure all products have consistent ID field
      const normalizedProducts = filteredProducts.map(product => ({
        ...product,
        _id: product._id || product.id // Ensure _id is always available
      }));
      
      setProducts(normalizedProducts);
      setTotalPages(Math.ceil(normalizedProducts.length / 6));
      return;
    }
    
    // Real API implementation
    setLoading(true);
    setError('');
    
    try {
      let response;
      
      if (searchQuery) {
        response = await productAPI.searchProducts(searchQuery);
      } else {
        response = await productAPI.getAllProducts({
          category: category !== 'All Categories' ? category : undefined,
          sort: getSortParam(sortBy),
          page,
          limit: 6
        });
      }
      
      // Ensure the response data is processed consistently
      const rawProducts = response.data.products || response.data || [];
      
      // Normalize products to ensure they have _id field
      const normalizedProducts = rawProducts.map(product => {
        const productId = getProductId(product);
        if (!productId) {
          console.warn('Product missing ID:', product);
        }
        return {
          ...product,
          _id: productId // Ensure _id is always available
        };
      }).filter(product => !!product._id); // Filter out any products without ID
      
      console.log('Fetched and normalized products:', normalizedProducts);
      
      setProducts(normalizedProducts);
      setTotalPages(response.data.totalPages || Math.ceil(normalizedProducts.length / 6));
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
      // Fallback to initial products if API fails
      const normalizedInitialProducts = initialProducts.map(product => ({
        ...product,
        _id: product._id || product.id
      }));
      setProducts(normalizedInitialProducts);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, category, sortBy, page, initialProducts]); // Include all dependencies
  
  // Effect to load products when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // fetchProducts is now memoized with useCallback
  
  // Update URL when search changes
  useEffect(() => {
    if (searchQuery) {
      const params = new URLSearchParams();
      params.set('q', searchQuery);
      navigate({ search: params.toString() });
    } else if (location.search) {
      // Clear search params if searchQuery is empty
      navigate({ search: '' });
    }
  }, [searchQuery, navigate, location.search]);
  
  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    fetchProducts(); // Explicitly call fetchProducts
  };
  
  // Handle product selection with debugging
  const handleProductSelect = (productId, productObject) => {
    console.log('Selecting product ID:', productId);
    if (!productId) {
      console.error('Invalid product ID:', productId);
      return;
    }
    
    console.log('Before toggling, selectedProducts:', selectedProducts);
    toggleProductSelection(productId, productObject);
    
    // Log after a delay to allow state update
    setTimeout(() => {
      console.log('After toggling (timeout), selectedProducts:', selectedProducts);
    }, 100);
  };
  
  // Navigate to comparison page
  const handleCompare = () => {
    if (selectedProducts.length > 1) {
      navigate(`/compare?products=${selectedProducts.join(',')}`);
    } else {
      alert('Please select at least 2 products to compare');
    }
  };
  
  // Reset all selections for debugging
  const handleResetSelections = () => {
    console.log('Resetting all selections');
    clearSelectedProducts();
  };
  
  // For debugging
  useEffect(() => {
    console.log('Selected products in state:', selectedProducts);
  }, [selectedProducts]);
  
  return (
    <Box className="page-transition">
      {/* Hero Section */}
      <Box
        sx={{
          pt: 6,
          pb: 6,
          backgroundColor: 'primary.main',
          color: 'white',
        }}
        className="eco-gradient-bg"
      >
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h3"
            gutterBottom
            sx={{ fontWeight: 'bold', textAlign: 'center' }}
          >
            Product Search
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, textAlign: 'center' }}>
            Find and compare eco-friendly products
          </Typography>
          
          {/* Search Form */}
          <Box 
            component="form" 
            onSubmit={handleSearch}
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              bgcolor: 'white',
              borderRadius: 2,
              p: 0.5,
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ 
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { border: "none" },
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button 
              type="submit" 
              variant="contained"
              size="large"
              sx={{ ml: 1 }}
            >
              Search
            </Button>
          </Box>
        </Container>
      </Box>
      
      {/* Main Content */}
      <Container sx={{ py: 6 }} maxWidth="lg">
        {/* Filters and Sort Row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl variant="outlined" sx={{ minWidth: 150 }}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
              >
                {productCategories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl variant="outlined" sx={{ minWidth: 150 }}>
              <InputLabel id="sort-by-label">Sort By</InputLabel>
              <Select
                labelId="sort-by-label"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
              >
                <MenuItem value="latest">Newest First</MenuItem>
                <MenuItem value="name_asc">Name (A-Z)</MenuItem>
                <MenuItem value="name_desc">Name (Z-A)</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Debug Reset Button */}
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<RefreshIcon />}
              onClick={handleResetSelections}
              size="small"
            >
              Reset Selections
            </Button>
            
            {/* Compare Button - Uses global context */}
            <Button
              variant="outlined"
              startIcon={<CompareArrowsIcon />}
              onClick={handleCompare}
              disabled={selectedProducts.length < 2}
            >
              COMPARE ({selectedProducts.length})
            </Button>
          </Box>
        </Box>
        
        {/* Debug Info */}
        <Button 
          variant="text" 
          onClick={logSelectionState}
          size="small"
        >
          Debug: Log Selection State
        </Button>
        
        {/* All Products Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">All Products</Typography>
          <Typography variant="body2" color="text.secondary">
            Showing {products.length} results
          </Typography>
        </Box>
        
        {/* Selected Products Info */}
        {selectedProducts.length > 0 && (
          <Alert 
            severity="info" 
            icon={<InfoIcon />}
            sx={{ mb: 3 }}
          >
            You've selected {selectedProducts.length} {selectedProducts.length === 1 ? 'product' : 'products'}
            {selectedProducts.length === 1 ? '. Select at least one more to compare.' : '.'}
          </Alert>
        )}
        
        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {/* Loading Indicator */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}
        
        {/* Products Grid */}
        <Grid container spacing={3}>
          {products.map((product) => {
            // Get product ID safely
            const productId = getProductId(product);
            const isSelected = selectedProducts.includes(productId);
            
            // Skip rendering products without an ID
            if (!productId) return null;
            
            return (
              <Grid item key={productId} xs={12} sm={6} md={4}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    border: isSelected ? '1px solid #2e7d32' : '1px solid #e0e0e0',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  {/* Product Image with generated SVG fallback */}
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.imageUrl}
                    alt={product.name}
                    onError={(e) => {
                      console.error(`Failed to load image for: ${product.name}`);
                      // Generate a colorful SVG placeholder as fallback
                      e.target.src = generateColorfulPlaceholder(product.name);
                    }}
                  />
                  
                  {/* Product Details */}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {product.name}
                    </Typography>
                    
                    <Chip 
                      label={product.category} 
                      size="small" 
                      sx={{ mb: 1 }} 
                    />
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Materials:</strong> {Array.isArray(product.materials) ? product.materials.join(', ') : 'Not specified'}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      <strong>Made in:</strong> {product.manufacturingLocation || 'Not specified'}
                    </Typography>
                  </CardContent>
                  
                  {/* Action Buttons - Updated to have 3 buttons with COMPARE in the middle */}
                  <CardActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                    <Button 
                      variant="outlined"
                      startIcon={<EcoIcon />}
                      size="small"
                      onClick={() => navigate(`/products/${productId}`)}
                    >
                      DETAILS
                    </Button>
                    
                    {/* New COMPARE button in the middle */}
                    <Button 
                      variant={isSelected ? "contained" : "outlined"}
                      color={isSelected ? "success" : "primary"}
                      size="small"
                      onClick={() => handleProductSelect(productId, product)}
                      startIcon={<CompareArrowsIcon />}
                    >
                      COMPARE
                    </Button>
                    
                    {/* Force analysis to start automatically */}
                    <Button 
                      variant="contained"
                      startIcon={<AnalyticsIcon />}
                      size="small"
                      onClick={() => {
                        // Directly trigger analysis instead of redirecting with ID
                        // This avoids the UUID format issue with the API
                        const productData = product;
                        navigate(`/analyze`, { 
                          state: { 
                            productData: productData, 
                            autoAnalyze: true 
                          }
                        });
                      }}
                    >
                      ANALYZE
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default ProductSearchPage;