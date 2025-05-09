import React, { useState, useEffect } from 'react';
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
  IconButton,
  Chip,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import EcoIcon from '@mui/icons-material/Eco';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { productAPI } from '../services/api';

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

function ProductSearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState(queryParams.get('q') || '');
  const [category, setCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('latest');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);
  
  // Mock initial products for display purposes
  const initialProducts = [
    {
      _id: '1',
      name: 'Eco-Friendly Smartphone',
      category: 'Electronics',
      description: 'Made with recycled materials and designed for easy repair and recycling at end of life.',
      materials: ['Recycled Aluminum', 'Recycled Plastic', 'Glass'],
      manufacturingLocation: 'Germany',
      imageUrl: 'https://via.placeholder.com/300x200?text=Eco+Phone'
    },
    {
      _id: '2',
      name: 'Organic Cotton T-Shirt',
      category: 'Clothing',
      description: 'Made with 100% organic cotton grown without harmful pesticides or synthetic fertilizers.',
      materials: ['Organic Cotton'],
      manufacturingLocation: 'Portugal',
      imageUrl: 'https://via.placeholder.com/300x200?text=Organic+Shirt'
    },
    {
      _id: '3',
      name: 'Bamboo Kitchen Utensils',
      category: 'Home Goods',
      description: 'Sustainable bamboo kitchen utensils that are biodegradable and renewable.',
      materials: ['Bamboo'],
      manufacturingLocation: 'Vietnam',
      imageUrl: 'https://via.placeholder.com/300x200?text=Bamboo+Utensils'
    },
    {
      _id: '4',
      name: 'Solar-Powered Power Bank',
      category: 'Electronics',
      description: 'Charge your devices using clean solar energy. Includes recycled components.',
      materials: ['Recycled Plastic', 'Silicon', 'Lithium Battery'],
      manufacturingLocation: 'China',
      imageUrl: 'https://via.placeholder.com/300x200?text=Solar+Power+Bank'
    },
    {
      _id: '5',
      name: 'Plant-Based Laundry Detergent',
      category: 'Home Goods',
      description: 'Biodegradable laundry detergent made from plant-derived ingredients.',
      materials: ['Plant Extracts', 'Natural Enzymes'],
      manufacturingLocation: 'USA',
      imageUrl: 'https://via.placeholder.com/300x200?text=Eco+Detergent'
    },
    {
      _id: '6',
      name: 'Recycled Paper Notebook',
      category: 'Home Goods',
      description: '100% recycled paper notebook with vegetable-based ink printing.',
      materials: ['Recycled Paper', 'Vegetable Ink'],
      manufacturingLocation: 'Canada',
      imageUrl: 'https://via.placeholder.com/300x200?text=Recycled+Notebook'
    }
  ];
  
  // Effect to load products
  useEffect(() => {
    setProducts(initialProducts);
    fetchProducts();
    // In a real implementation, we would use:
    // fetchProducts(searchQuery, category, sortBy, page);
  }, [searchQuery, category, sortBy, page]);
  
  // Update URL when search changes
  useEffect(() => {
    if (searchQuery) {
      const params = new URLSearchParams();
      params.set('q', searchQuery);
      navigate({ search: params.toString() });
    }
  }, [searchQuery, navigate]);
  
  // Function to fetch products from API
  const fetchProducts = async () => {
    // In a real implementation, we would call the API with filters
    /*
    setLoading(true);
    setError('');
    
    try {
      let response;
      
      if (searchQuery) {
        response = await productAPI.searchProducts(searchQuery);
      } else {
        response = await productAPI.getAllProducts();
      }
      
      // Filter by category if not "All Categories"
      let filteredProducts = response.data;
      if (category !== 'All Categories') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
      }
      
      // Sort products
      const sortedProducts = sortProducts(filteredProducts, sortBy);
      
      setProducts(sortedProducts);
      setTotalPages(Math.ceil(sortedProducts.length / 6)); // 6 products per page
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
    */
  };
  
  // Function to sort products
  const sortProducts = (products, sortMethod) => {
    switch (sortMethod) {
      case 'latest':
        return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'name_asc':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return [...products].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return products;
    }
  };
  
  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    // fetchProducts will be called via useEffect
  };
  
  // Handle product selection for comparison
  const handleSelectForComparison = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      if (selectedProducts.length < 3) {
        setSelectedProducts([...selectedProducts, productId]);
      } else {
        alert('You can only compare up to 3 products at a time.');
      }
    }
  };
  
  // Navigate to comparison page
  const handleCompare = () => {
    if (selectedProducts.length > 1) {
      navigate(`/compare?products=${selectedProducts.join(',')}`);
    }
  };
  
  // Render product card
  const renderProductCard = (product) => {
    const isSelected = selectedProducts.includes(product._id);
    
    return (
      <Card 
        key={product._id} 
        className="product-card"
        sx={{
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          border: isSelected ? '2px solid' : 'none',
          borderColor: isSelected ? 'primary.main' : 'transparent'
        }}
      >
        <CardMedia
          component="img"
          height="140"
          image={product.imageUrl || `https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div">
            {product.name}
          </Typography>
          <Chip
            label={product.category}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ mb: 1 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Materials: {product.materials.join(', ')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Made in: {product.manufacturingLocation}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'space-between' }}>
          <Button 
            size="small" 
            startIcon={<EcoIcon />}
            onClick={() => navigate(`/products/${product._id}`)}
          >
            Details
          </Button>
          <Button 
            size="small" 
            startIcon={<AnalyticsIcon />}
            onClick={() => navigate(`/analyze?productId=${product._id}`)}
          >
            Analyze
          </Button>
          <IconButton 
            size="small" 
            color={isSelected ? "primary" : "default"}
            onClick={() => handleSelectForComparison(product._id)}
            title={isSelected ? "Remove from comparison" : "Add to comparison"}
          >
            <CompareArrowsIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  };
  
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
        {/* Filters and Sort */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', md: 'center' },
            mb: 4,
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <FormControl variant="outlined" sx={{ minWidth: 150 }}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                {productCategories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl variant="outlined" sx={{ minWidth: 150 }}>
              <InputLabel id="sort-label">Sort By</InputLabel>
              <Select
                labelId="sort-label"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
                startAdornment={
                  <InputAdornment position="start">
                    <SortIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="latest">Newest First</MenuItem>
                <MenuItem value="name_asc">Name (A-Z)</MenuItem>
                <MenuItem value="name_desc">Name (Z-A)</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          {selectedProducts.length > 0 && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<CompareArrowsIcon />}
              onClick={handleCompare}
              disabled={selectedProducts.length < 2}
            >
              Compare {selectedProducts.length > 0 && `(${selectedProducts.length})`}
            </Button>
          )}
        </Box>
        
        {/* Results count and info */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1">
            {searchQuery ? 
              `Search results for "${searchQuery}"` : 
              category !== 'All Categories' ? 
                `Showing ${category} products` : 
                'All Products'
            }
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Showing {products.length} results
          </Typography>
        </Box>
        
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
        
        {/* No Results */}
        {!loading && products.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h5" gutterBottom>
              No products found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search or filters to find what you're looking for.
            </Typography>
            <Button 
              variant="contained" 
              sx={{ mt: 3 }}
              onClick={() => {
                setSearchQuery('');
                setCategory('All Categories');
                setSortBy('latest');
              }}
            >
              Clear Filters
            </Button>
          </Box>
        )}
        
        {/* Product Grid */}
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item key={product._id} xs={12} sm={6} md={4}>
              {renderProductCard(product)}
            </Grid>
          ))}
        </Grid>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={(e, value) => setPage(value)}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default ProductSearchPage;