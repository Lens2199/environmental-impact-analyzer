import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

// Import the API service and context
import { productAPI, analysisAPI } from '../services/api';
import { useAppContext } from '../context/AppContext';

// Mock analysis data for development
const mockAnalyses = {
  '1': {
    id: 'a1',
    scores: {
      overall: 8.2,
      carbon: 7.5,
      water: 8.7,
      resources: 8.4
    },
    explanation: "This eco-friendly smartphone is designed with sustainability in mind. Made with recycled materials and built for easy repair and recycling at end of life. The use of recycled aluminum and plastic reduces resource consumption, and the manufacturing location in Germany typically means stricter environmental regulations.",
    suggestions: "Consider implementing a take-back program. Increase use of renewable energy in manufacturing. Source materials closer to production facility to reduce transportation impacts."
  },
  '2': {
    id: 'a2',
    scores: {
      overall: 8.5,
      carbon: 7.8,
      water: 6.5,
      resources: 9.2
    },
    explanation: "This organic cotton t-shirt has a positive environmental impact compared to conventional cotton products. Organic cotton production significantly reduces pesticide and synthetic fertilizer use. Manufacturing in Portugal ensures ethical production standards and reduces transportation emissions for European markets.",
    suggestions: "Consider using natural or low-impact dyes. Implement water recycling in the manufacturing process. Source cotton from regenerative farms."
  },
  '3': {
    id: 'a3',
    scores: {
      overall: 9.0,
      carbon: 8.9,
      water: 9.2,
      resources: 9.1
    },
    explanation: "These bamboo kitchen utensils have an excellent environmental profile. Bamboo is a rapidly renewable resource with limited water requirements. The manufacturing in Vietnam is close to the bamboo source, reducing transportation impacts. The product is naturally biodegradable at end of life.",
    suggestions: "Ensure fair labor practices in bamboo harvesting. Consider using solar energy in manufacturing. Use plastic-free packaging."
  },
  '4': {
    id: 'a4',
    scores: {
      overall: 7.8,
      carbon: 7.5,
      water: 8.0,
      resources: 7.9
    },
    explanation: "This solar-powered power bank offers good environmental benefits by utilizing renewable energy. The use of recycled plastic in construction is commendable. Manufacturing in China may increase carbon footprint due to transportation and potentially coal-based electricity usage.",
    suggestions: "Increase the percentage of recycled materials. Source components locally to manufacturing location. Improve end-of-life recyclability through better design."
  },
  '5': {
    id: 'a5',
    scores: {
      overall: 8.7,
      carbon: 8.3,
      water: 9.0,
      resources: 8.8
    },
    explanation: "This plant-based laundry detergent offers significant environmental benefits. The use of plant extracts and natural enzymes reduces aquatic toxicity and biodegrades readily. Manufacturing in the USA reduces transportation impacts for North American markets.",
    suggestions: "Consider concentrated formulation to reduce packaging and transportation impacts. Use recycled plastic in packaging or explore plastic-free alternatives."
  },
  '6': {
    id: 'a6',
    scores: {
      overall: 8.9,
      carbon: 8.7,
      water: 8.5,
      resources: 9.5
    },
    explanation: "This recycled paper notebook has excellent resource efficiency. 100% recycled paper significantly reduces virgin resource consumption and waste. Vegetable-based inks eliminate toxic heavy metals and improve recyclability. Manufacturing in Canada ensures strong environmental regulations.",
    suggestions: "Consider using renewable energy in manufacturing. Explore plastic-free binding options. Ensure FSC certification for any virgin paper components."
  }
};

// Mock product data for fallback
const mockProducts = [
  {
    id: '1',
    name: 'Eco-Friendly Smartphone',
    category: 'Electronics',
    description: 'Made with recycled materials and designed for easy repair and recycling at end of life.',
    materials: ['Recycled Aluminum', 'Recycled Plastic', 'Glass'],
    manufacturingLocation: 'Germany',
    imageUrl: '/pic/Eco-Friendly Smartphone.jpg'
  },
  {
    id: '2',
    name: 'Organic Cotton T-Shirt',
    category: 'Clothing',
    description: 'Made with 100% organic cotton grown without harmful pesticides or synthetic fertilizers.',
    materials: ['Organic Cotton'],
    manufacturingLocation: 'Portugal',
    imageUrl: '/pic/Organic Cotton T-Shirt.jpg'
  },
  {
    id: '3',
    name: 'Bamboo Kitchen Utensils',
    category: 'Home Goods',
    description: 'Sustainable bamboo kitchen utensils that are biodegradable and renewable.',
    materials: ['Bamboo'],
    manufacturingLocation: 'Vietnam',
    imageUrl: '/pic/Bamboo Kitchen Utensils.jpg'
  },
  {
    id: '4',
    name: 'Solar-Powered Power Bank',
    category: 'Electronics',
    description: 'Charge your devices using clean solar energy. Includes recycled components.',
    materials: ['Recycled Plastic', 'Silicon', 'Lithium Battery'],
    manufacturingLocation: 'China',
    imageUrl: '/pic/Solar-Powered Power Bank.jpg'
  },
  {
    id: '5',
    name: 'Plant-Based Laundry Detergent',
    category: 'Home Goods',
    description: 'Biodegradable laundry detergent made from plant-derived ingredients.',
    materials: ['Plant Extracts', 'Natural Enzymes'],
    manufacturingLocation: 'USA',
    imageUrl: '/pic/Plant-Based Laundry Detergent.jpg'
  },
  {
    id: '6',
    name: 'Recycled Paper Notebook',
    category: 'Home Goods',
    description: '100% recycled paper notebook with vegetable-based ink printing.',
    materials: ['Recycled Paper', 'Vegetable Ink'],
    manufacturingLocation: 'Canada',
    imageUrl: '/pic/Recycled Paper Notebook.jpg'
  }
];

function ComparisonPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get context to access selected product objects
  const { selectedProducts, selectedProductObjects, getProductId } = useAppContext();
  
  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [analyses, setAnalyses] = useState({});
  
  // Use useRef to track if data has been fetched to prevent infinite loops
  const dataFetchedRef = useRef(false);
  
  // Memoize productIds to prevent unnecessary re-renders
  const productIds = useMemo(() => {
    // Parse product IDs from URL or use context
    const params = new URLSearchParams(location.search);
    const idsFromURL = params.get('products')?.split(',') || [];
    
    // Return URL IDs if present, otherwise use selectedProducts from context
    return idsFromURL.length > 0 ? idsFromURL : selectedProducts;
  }, [location.search, selectedProducts]);
  
  // Helper to create a mock analysis for a product
  const createMockAnalysis = useCallback((product) => {
    const scores = {
      overall: Math.round((6 + Math.random() * 4) * 10) / 10,
      carbon: Math.round((6 + Math.random() * 4) * 10) / 10,
      water: Math.round((6 + Math.random() * 4) * 10) / 10,
      resources: Math.round((6 + Math.random() * 4) * 10) / 10
    };
    
    return {
      id: `mock-${getProductId(product)}`,
      scores,
      explanation: `This ${product.category} product has a moderate to good environmental impact. ${
        product.materials ? `It is made from ${product.materials.join(', ')}.` : ''
      } ${
        product.manufacturingLocation ? `Manufacturing in ${product.manufacturingLocation} impacts its overall footprint.` : ''
      }`,
      suggestions: "Consider sustainable sourcing of materials. Reduce packaging waste. Implement renewable energy in manufacturing."
    };
  }, [getProductId]);
  
  // Memoize fetchAnalysesForProducts to prevent re-creation on every render
  const fetchAnalysesForProducts = useCallback(async (productsToAnalyze) => {
    const analysisResults = {};
    
    // Use mock data in development mode
    if (process.env.NODE_ENV === 'development') {
      for (const product of productsToAnalyze) {
        const productId = getProductId(product);
        analysisResults[productId] = mockAnalyses[productId] || createMockAnalysis(product);
      }
      setAnalyses(analysisResults);
      return;
    }
    
    // In production, fetch real analyses
    for (const product of productsToAnalyze) {
      const productId = getProductId(product);
      try {
        const response = await analysisAPI.getAnalysisByProductId(productId);
        analysisResults[productId] = response.data;
      } catch (err) {
        console.error(`Error fetching analysis for product ${productId}:`, err);
        // Use mock data as fallback
        analysisResults[productId] = mockAnalyses[productId] || createMockAnalysis(product);
      }
    }
    
    setAnalyses(analysisResults);
  }, [getProductId, createMockAnalysis]);
  
  // Memoize fetch product data function
  const fetchProductData = useCallback(async () => {
    // Skip if no product IDs or if data has already been fetched
    if (productIds.length === 0) {
      return;
    }
    
    console.log('Fetching products for IDs:', productIds);
    setLoading(true);
    setError('');
    
    try {
      // Try to use stored product objects first
      if (selectedProductObjects.length >= productIds.length) {
        console.log('Using stored product objects:', selectedProductObjects);
        
        // Filter to only the products we need
        const relevantProducts = selectedProductObjects.filter(
          product => productIds.includes(getProductId(product))
        );
        
        if (relevantProducts.length === productIds.length) {
          setProducts(relevantProducts);
          
          // Now fetch analyses for these products
          await fetchAnalysesForProducts(relevantProducts);
          return;
        }
      }
      
      // Fallback: Fetch products from API
      console.log('Fetching products from API as fallback');
      const fetchedProducts = [];
      
      for (const id of productIds) {
        try {
          const response = await productAPI.getProductById(id);
          fetchedProducts.push(response.data);
        } catch (err) {
          console.error(`Error fetching product with ID ${id}:`, err);
          // If in development, use mock data
          if (process.env.NODE_ENV === 'development') {
            // Find the product from our mock list based on ID
            const mockProduct = mockProducts.find(p => p.id === id);
            if (mockProduct) {
              fetchedProducts.push(mockProduct);
            }
          }
        }
      }
      
      if (fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
        
        // Now fetch analyses for these products
        await fetchAnalysesForProducts(fetchedProducts);
      } else {
        setError('No products could be found for comparison.');
      }
    } catch (err) {
      console.error('Error fetching comparison data:', err);
      setError(err.message || 'Failed to load comparison data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [productIds, selectedProductObjects, getProductId, fetchAnalysesForProducts]);
  
  // Fetch products only once (using useRef to prevent infinite loops)
  useEffect(() => {
    if (!dataFetchedRef.current) {
      dataFetchedRef.current = true;
      fetchProductData();
    }
  }, [fetchProductData]);
  
  // Navigate back to products
  const handleBack = () => {
    navigate('/');
  };
  
  // Get score color class
  const getScoreColorClass = (score) => {
    if (score >= 9) return 'score-excellent';
    else if (score >= 7) return 'score-good';
    else if (score >= 5) return 'score-average';
    else if (score >= 3) return 'score-poor';
    else return 'score-bad';
  };
  
  // Get score color for styling
  const getScoreColor = (score) => {
    if (score >= 9) return '#43a047';
    else if (score >= 7) return '#7cb342';
    else if (score >= 5) return '#fdd835';
    else if (score >= 3) return '#fb8c00';
    else return '#e53935';
  };
  
  // Find the best product based on overall score
  const getBestProduct = () => {
    if (Object.keys(analyses).length === 0 || products.length === 0) return null;
    
    let bestId = null;
    let bestScore = -1;
    
    for (const product of products) {
      const id = getProductId(product);
      const analysis = analyses[id];
      
      if (analysis && analysis.scores.overall > bestScore) {
        bestScore = analysis.scores.overall;
        bestId = id;
      }
    }
    
    return products.find(p => getProductId(p) === bestId) || null;
  };
  
  // Get best product for a specific category
  const getBestForCategory = (category) => {
    if (Object.keys(analyses).length === 0 || products.length === 0) return null;
    
    let bestId = null;
    let bestScore = -1;
    
    for (const product of products) {
      const id = getProductId(product);
      const analysis = analyses[id];
      
      if (analysis && analysis.scores[category] > bestScore) {
        bestScore = analysis.scores[category];
        bestId = id;
      }
    }
    
    return products.find(p => getProductId(p) === bestId) || null;
  };
  
  const bestProduct = getBestProduct();
  
  return (
    <Box className="page-transition">
      {/* Header Section */}
      <Box
        sx={{
          pt: 6,
          pb: 6,
          backgroundColor: 'primary.main',
          color: 'white',
        }}
        className="eco-gradient-bg"
      >
        <Container maxWidth="lg">
          <Typography
            component="h1"
            variant="h3"
            gutterBottom
            sx={{ fontWeight: 'bold', textAlign: 'center' }}
          >
            Product Comparison
          </Typography>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
            Compare environmental impact of selected products
          </Typography>
        </Container>
      </Box>
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Back Button */}
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          sx={{ mb: 3 }}
        >
          Back to Products
        </Button>
        
        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {/* No Products Selected */}
        {!loading && products.length === 0 && (
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              No Products Selected for Comparison
            </Typography>
            <Typography variant="body1" paragraph>
              Please select at least two products to compare their environmental impact.
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleBack}
              startIcon={<CompareArrowsIcon />}
            >
              Select Products
            </Button>
          </Paper>
        )}
        
        {/* Loading State */}
        {loading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading comparison data...
            </Typography>
          </Box>
        )}
        
        {/* Comparison Content */}
        {!loading && products.length > 0 && (
          <>
            {/* Best Product */}
            {bestProduct && (
              <Paper elevation={3} sx={{ p: 3, mb: 4, borderLeft: '5px solid #43a047' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Typography variant="h5" gutterBottom>
                      Most Eco-Friendly Option
                    </Typography>
                    <Typography variant="h6" color="primary.main" gutterBottom>
                      {bestProduct.name}
                    </Typography>
                    <Typography variant="body1">
                      {analyses[getProductId(bestProduct)]?.explanation.split('.')[0]}.
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                    <Box 
                      className={`analysis-score-circle ${getScoreColorClass(analyses[getProductId(bestProduct)]?.scores.overall)}`}
                      sx={{ width: 100, height: 100, fontSize: '2rem', mb: 1, mx: 'auto' }}
                    >
                      {analyses[getProductId(bestProduct)]?.scores.overall}
                    </Box>
                    <Typography variant="subtitle1">
                      Overall Environment Score
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}
            
            {/* Score Comparison Table */}
            <TableContainer component={Paper} sx={{ mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.main' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Product</TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Overall</TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Carbon Footprint</TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Water Usage</TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Resource Consumption</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map(product => {
                    const productId = getProductId(product);
                    const analysis = analyses[productId];
                    
                    if (!analysis) return null;
                    
                    const isBestOverall = bestProduct && getProductId(bestProduct) === productId;
                    const isBestCarbon = getProductId(getBestForCategory('carbon')) === productId;
                    const isBestWater = getProductId(getBestForCategory('water')) === productId;
                    const isBestResources = getProductId(getBestForCategory('resources')) === productId;
                    
                    return (
                      <TableRow key={productId} sx={{ backgroundColor: isBestOverall ? 'rgba(67, 160, 71, 0.08)' : 'inherit' }}>
                        <TableCell component="th" scope="row">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                              component="img"
                              src={product.imageUrl || `https://via.placeholder.com/50x50?text=${encodeURIComponent(product.name)}`}
                              alt={product.name}
                              sx={{ width: 50, height: 50, mr: 2, objectFit: 'cover', borderRadius: 1 }}
                              onError={(e) => {
                                e.target.src = `https://via.placeholder.com/50x50?text=${encodeURIComponent(product.name)}`;
                              }}
                            />
                            <Box>
                              <Typography variant="subtitle1">{product.name}</Typography>
                              <Typography variant="body2" color="text.secondary">{product.category}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography
                              variant="h6"
                              sx={{
                                color: getScoreColor(analysis.scores.overall),
                                fontWeight: 'bold',
                              }}
                            >
                              {analysis.scores.overall}
                            </Typography>
                            {isBestOverall && (
                              <Chip
                                label="BEST"
                                size="small"
                                color="success"
                                sx={{ ml: 1, height: 20 }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography
                              variant="h6"
                              sx={{
                                color: getScoreColor(analysis.scores.carbon),
                                fontWeight: 'bold',
                              }}
                            >
                              {analysis.scores.carbon}
                            </Typography>
                            {isBestCarbon && (
                              <Chip
                                label="BEST"
                                size="small"
                                color="success"
                                sx={{ ml: 1, height: 20 }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography
                              variant="h6"
                              sx={{
                                color: getScoreColor(analysis.scores.water),
                                fontWeight: 'bold',
                              }}
                            >
                              {analysis.scores.water}
                            </Typography>
                            {isBestWater && (
                              <Chip
                                label="BEST"
                                size="small"
                                color="success"
                                sx={{ ml: 1, height: 20 }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography
                              variant="h6"
                              sx={{
                                color: getScoreColor(analysis.scores.resources),
                                fontWeight: 'bold',
                              }}
                            >
                              {analysis.scores.resources}
                            </Typography>
                            {isBestResources && (
                              <Chip
                                label="BEST"
                                size="small"
                                color="success"
                                sx={{ ml: 1, height: 20 }}
                              />
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Individual Product Cards */}
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              Product Details
            </Typography>
            <Grid container spacing={3}>
              {products.map(product => {
                const productId = getProductId(product);
                const analysis = analyses[productId];
                
                if (!analysis) return null;
                
                return (
                  <Grid item key={productId} xs={12} md={6} lg={4}>
                    <Card elevation={3} sx={{ height: '100%' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.imageUrl || `https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}`}
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}`;
                        }}
                      />
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {product.name}
                        </Typography>
                        <Chip 
                          label={product.category} 
                          size="small" 
                          sx={{ mb: 2 }} 
                        />
                        
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          <strong>Overall Score:</strong> 
                          <span style={{ color: getScoreColor(analysis.scores.overall), fontWeight: 'bold', marginLeft: 8 }}>
                            {analysis.scores.overall}
                          </span>
                        </Typography>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Typography variant="subtitle2" gutterBottom>
                          Environmental Impact
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {analysis.explanation.split('.')[0]}.
                        </Typography>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Typography variant="subtitle2" gutterBottom>
                          Materials
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {Array.isArray(product.materials) ? product.materials.join(', ') : 'Not specified'}
                        </Typography>
                        
                        <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
                          Made in
                        </Typography>
                        <Typography variant="body2">
                          {product.manufacturingLocation || 'Not specified'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
            
            {/* Alert about mock data in development */}
            {process.env.NODE_ENV === 'development' && (
              <Alert severity="info" sx={{ mt: 4 }}>
                <Typography variant="body2">
                  Note: In development mode, this page uses simulated analysis data. In production, real API data will be used.
                </Typography>
              </Alert>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}

export default ComparisonPage;