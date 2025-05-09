import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Tabs,
  Tab,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import { Link } from 'react-router-dom';
import EcoIcon from '@mui/icons-material/Eco';
import PlaceIcon from '@mui/icons-material/Place';
import CategoryIcon from '@mui/icons-material/Category';
import ConstructionIcon from '@mui/icons-material/Construction';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import InfoIcon from '@mui/icons-material/Info';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { productAPI, analysisAPI } from '../services/api';

// Component to display individual score
const ScoreCircle = ({ score, label, size = 'medium' }) => {
  let scoreClass = '';
  
  if (score >= 9) scoreClass = 'score-excellent';
  else if (score >= 7) scoreClass = 'score-good';
  else if (score >= 5) scoreClass = 'score-average';
  else if (score >= 3) scoreClass = 'score-poor';
  else scoreClass = 'score-bad';
  
  const circleSize = size === 'large' ? 100 : size === 'medium' ? 60 : 40;
  const fontSize = size === 'large' ? '2rem' : size === 'medium' ? '1.25rem' : '1rem';
  
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box 
        className={`analysis-score-circle ${scoreClass}`}
        sx={{ 
          width: circleSize, 
          height: circleSize, 
          fontSize, 
          mb: 1,
          mx: 'auto'
        }}
      >
        {score}
      </Box>
      <Typography variant={size === 'small' ? 'body2' : 'body1'} component="div">
        {label}
      </Typography>
    </Box>
  );
};

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  
  // Mock product data for display
  const mockProduct = {
    _id: id,
    name: 'Eco-Friendly Smartphone',
    description: 'This smartphone is designed with sustainability in mind. It features a modular design for easy repair, recycled aluminum casing, and is manufactured using renewable energy. The device comes with a biodegradable protective case and minimal packaging to reduce waste.',
    category: 'Electronics',
    materials: ['Recycled Aluminum', 'Recycled Plastic', 'Glass', 'Silicon'],
    manufacturingLocation: 'Germany',
    additionalDetails: 'This product is certified by the Electronic Product Environmental Assessment Tool (EPEAT) with a Gold rating. The manufacturer has committed to a take-back program for proper recycling at end of life.',
    imageUrl: 'https://via.placeholder.com/600x400?text=Eco+Friendly+Smartphone'
  };
  
  // Mock analysis data
  const mockAnalysis = {
    _id: 'a1',
    product: id,
    scores: {
      carbon: 8,
      water: 7,
      resources: 9,
      overall: 8
    },
    explanation: 'This smartphone demonstrates strong environmental credentials through its use of recycled materials, modular design for repairability, and manufacturing powered by renewable energy. The recycled aluminum casing significantly reduces the carbon footprint compared to virgin aluminum. Water usage in manufacturing is reduced through efficient processes, though there's still room for improvement. Resource consumption scores highly due to the modular design that extends product life and facilitates end-of-life recycling.',
    suggestions: 'To further improve environmental performance, the manufacturer could: 1. Increase the percentage of recycled materials in components. 2. Implement more water-efficient manufacturing processes. 3. Use biodegradable or compostable materials for more components. 4. Extend the warranty period to encourage longer use.',
    createdAt: new Date().toISOString(),
  };
  
  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError('');
      
      try {
        // In a real app, we would use:
        // const response = await productAPI.getProductById(id);
        // setProduct(response.data);
        
        // For demo purposes, use mock data
        setTimeout(() => {
          setProduct(mockProduct);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again.');
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [id]);
  
  // Fetch latest analysis if it exists
  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        // In a real app, we would use:
        // const response = await analysisAPI.getAnalysisById(id);
        // if (response.data) {
        //   setAnalysis(response.data);
        // }
        
        // For demo purposes, use mock data
        setTimeout(() => {
          setAnalysis(mockAnalysis);
        }, 1500);
        
      } catch (err) {
        // Analysis might not exist yet, which is fine
        console.log('No existing analysis found');
      }
    };
    
    if (!loading && product) {
      fetchAnalysis();
    }
  }, [id, product, loading]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Analyze product
  const handleAnalyzeProduct = async () => {
    setAnalyzing(true);
    setAnalysisError('');
    
    try {
      // In a real app, we would use:
      // const response = await analysisAPI.analyzeExistingProduct(id);
      // setAnalysis(response.data);
      
      // For demo purposes, use mock data with timeout
      setTimeout(() => {
        setAnalysis(mockAnalysis);
        setAnalyzing(false);
      }, 2000);
      
    } catch (err) {
      console.error('Error analyzing product:', err);
      setAnalysisError('Failed to analyze product. Please try again.');
      setAnalyzing(false);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<NavigateNextIcon />}
          onClick={() => navigate('/search')}
        >
          Back to Search
        </Button>
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
          <MuiLink component={Link} to={`/search?category=${product.category}`} color="inherit">
            {product.category}
          </MuiLink>
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>
        
        {/* Product Details */}
        <Grid container spacing={4}>
          {/* Product Image */}
          <Grid item xs={12} md={5}>
            <Paper 
              elevation={2} 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                overflow: 'hidden',
                borderRadius: 2
              }}
            >
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                style={{ width: '100%', height: 'auto' }} 
              />
            </Paper>
          </Grid>
          
          {/* Product Info */}
          <Grid item xs={12} md={7}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CategoryIcon sx={{ color: 'primary.main', mr: 1 }} />
              <Chip label={product.category} size="medium" />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <PlaceIcon sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="body1">
                Made in {product.manufacturingLocation}
              </Typography>
            </Box>
            
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            
            <Typography variant="h6" gutterBottom>
              Materials
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {product.materials.map((material, index) => (
                <Chip 
                  key={index} 
                  label={material} 
                  size="small" 
                  variant="outlined" 
                  icon={<ConstructionIcon />} 
                />
              ))}
            </Box>
            
            {product.additionalDetails && (
              <>
                <Typography variant="h6" gutterBottom>
                  Additional Details
                </Typography>
                <Typography variant="body1" paragraph>
                  {product.additionalDetails}
                </Typography>
              </>
            )}
            
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<AnalyticsIcon />}
                onClick={handleAnalyzeProduct}
                disabled={analyzing}
              >
                {analyzing ? 'Analyzing...' : analysis ? 'Re-Analyze' : 'Analyze Impact'}
              </Button>
              <Button 
                variant="outlined"
                startIcon={<CompareArrowsIcon />}
                onClick={() => navigate(`/compare?products=${id}`)}
              >
                Compare
              </Button>
            </Box>
            
            {analysisError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {analysisError}
              </Alert>
            )}
          </Grid>
        </Grid>
        
        {/* Analysis Results */}
        {(analysis || analyzing) && (
          <Paper elevation={3} sx={{ mt: 6, mb: 4, borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ px: 3, py: 2, backgroundColor: 'primary.main', color: 'white' }}>
              <Typography variant="h5">
                Environmental Impact Analysis
              </Typography>
            </Box>
            
            {analyzing ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Analyzing Environmental Impact...
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  This may take a few moments as our AI evaluates the product details.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ p: 3 }}>
                <Tabs 
                  value={activeTab} 
                  onChange={handleTabChange} 
                  centered
                  sx={{ mb: 3 }}
                >
                  <Tab icon={<AnalyticsIcon />} label="SCORES" />
                  <Tab icon={<InfoIcon />} label="DETAILS" />
                </Tabs>
                
                {activeTab === 0 && (
                  <Box>
                    {/* Overall Score */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                      <Typography variant="h5" gutterBottom>
                        Overall Environmental Score
                      </Typography>
                      <ScoreCircle 
                        score={analysis.scores.overall} 
                        label="Overall" 
                        size="large" 
                      />
                    </Box>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    {/* Individual Scores */}
                    <Grid container spacing={4} sx={{ mt: 1 }}>
                      <Grid item xs={12} md={4}>
                        <ScoreCircle 
                          score={analysis.scores.carbon} 
                          label="Carbon Footprint" 
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <ScoreCircle 
                          score={analysis.scores.water} 
                          label="Water Usage" 
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <ScoreCircle 
                          score={analysis.scores.resources} 
                          label="Resource Consumption" 
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}
                
                {activeTab === 1 && (
                  <Box>
                    <Card variant="outlined" sx={{ mb: 3 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Analysis Explanation
                        </Typography>
                        <Typography variant="body1">
                          {analysis.explanation}
                        </Typography>
                      </CardContent>
                    </Card>
                    
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Improvement Suggestions
                        </Typography>
                        <List>
                          {analysis.suggestions.split(/\d+\./).filter(s => s.trim()).map((suggestion, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <EcoIcon color="primary" />
                              </ListItemIcon>
                              <ListItemText primary={suggestion.trim()} />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                    
                    <Box sx={{ mt: 3, textAlign: 'right' }}>
                      <Typography variant="body2" color="text.secondary">
                        Analysis performed: {new Date(analysis.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        )}
        
        {/* Similar Products */}
        <Box sx={{ mt: 6, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Similar Products
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            Compare with other products in the same category
          </Typography>
          
          <Grid container spacing={3}>
            {/* Placeholder similar products */}
            {[
              {
                _id: 's1',
                name: 'Fairphone 4',
                category: 'Electronics',
                imageUrl: 'https://via.placeholder.com/300x200?text=Fairphone+4'
              },
              {
                _id: 's2',
                name: 'Teracube 2e',
                category: 'Electronics',
                imageUrl: 'https://via.placeholder.com/300x200?text=Teracube+2e'
              },
              {
                _id: 's3',
                name: 'Shift6m',
                category: 'Electronics',
                imageUrl: 'https://via.placeholder.com/300x200?text=Shift6m'
              }
            ].map((similarProduct) => (
              <Grid item key={similarProduct._id} xs={12} sm={6} md={4}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 4
                    }
                  }}
                  onClick={() => navigate(`/products/${similarProduct._id}`)}
                >
                  <img 
                    src={similarProduct.imageUrl} 
                    alt={similarProduct.name} 
                    style={{ width: '100%', height: 'auto', marginBottom: '12px' }} 
                  />
                  <Typography variant="h6" align="center">
                    {similarProduct.name}
                  </Typography>
                  <Chip 
                    label={similarProduct.category} 
                    size="small" 
                    sx={{ mt: 1 }} 
                  />
                  <Button
                    variant="text"
                    color="primary"
                    startIcon={<CompareArrowsIcon />}
                    sx={{ mt: 2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/compare?products=${id},${similarProduct._id}`);
                    }}
                  >
                    Compare
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default ProductDetailPage;