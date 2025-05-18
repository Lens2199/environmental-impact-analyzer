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
import EcoIcon from '../components/icons/EcoIcon';
import PlaceIcon from '@mui/icons-material/Place';
import CategoryIcon from '@mui/icons-material/Category';
import ConstructionIcon from '@mui/icons-material/Construction';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import InfoIcon from '@mui/icons-material/Info';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { productAPI, analysisAPI } from '../services/api';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import { formatDate } from '../utils/helpers';

// Import product images
import ecoPhoneImage from '../assets/pic/Eco-Friendly Smartphone.jpg';
import organicShirtImage from '../assets/pic/Organic Cotton T-Shirt.jpg';
import bambooUtensilsImage from '../assets/pic/Bamboo Kitchen Utensils.jpg';
import solarPowerBankImage from '../assets/pic/Solar-Powered Power Bank.jpg';
import ecoDetergentImage from '../assets/pic/Plant-Based Laundry Detergent.jpg';
import recycledNotebookImage from '../assets/pic/Recycled Paper Notebook.jpg';

// Generate colorful placeholders if images fail to load
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

// Function to get the correct product image based on ID
const getProductImage = (id) => {
  switch(id) {
    case '1': return ecoPhoneImage;
    case '2': return organicShirtImage;
    case '3': return bambooUtensilsImage;
    case '4': return solarPowerBankImage;
    case '5': return ecoDetergentImage;
    case '6': return recycledNotebookImage;
    default: return null;
  }
};

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

// Mock similar products for the category
const getSimilarProducts = (category) => {
  return [
    {
      id: 'similar1',
      name: 'Similar Product 1',
      category: category,
      description: 'Another eco-friendly product in the same category.',
      materials: ['Sustainable Material 1', 'Sustainable Material 2'],
      manufacturingLocation: 'Canada'
    },
    {
      id: 'similar2',
      name: 'Similar Product 2',
      category: category,
      description: 'Another alternative with different materials.',
      materials: ['Recycled Material', 'Biodegradable Components'],
      manufacturingLocation: 'Finland'
    },
    {
      id: 'similar3',
      name: 'Similar Product 3',
      category: category,
      description: 'A third option for environmentally conscious consumers.',
      materials: ['Organic Components', 'Renewable Resource'],
      manufacturingLocation: 'Sweden'
    }
  ];
};

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State variables
  const [product, setProduct] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [, setSimilarProducts] = useState([]);
  
  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await productAPI.getProductById(id);
        setProduct(response.data);
        // Initialize similar products based on the category
        if (response.data && response.data.category) {
          setSimilarProducts(getSimilarProducts(response.data.category));
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to load product details. Please try again.');
        setLoading(false);
        
        // If we're in development mode, create mock data for display
        if (process.env.NODE_ENV === 'development' || process.env.REACT_APP_USE_MOCK_DATA === 'true') {
          const mockProduct = {
            id: id,
            name: id === '2' ? 'Organic Cotton T-Shirt' : `Product ${id}`,
            category: 'Clothing',
            description: 'Made with 100% organic cotton grown without harmful pesticides or synthetic fertilizers.',
            materials: ['Organic Cotton'],
            manufacturing_location: 'Portugal',
            image_url: id === '2' ? organicShirtImage : null
          };
          
          setProduct(mockProduct);
          setSimilarProducts(getSimilarProducts('Clothing'));
          setLoading(false);
          setError(''); // Clear error since we have fallback data
        }
      }
    };
    
    fetchProductData();
  }, [id]);
  
  // Fetch latest analysis if it exists
  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await analysisAPI.getProductAnalysis(id);
        setAnalysis(response.data);
      } catch (err) {
        // Analysis might not exist yet, which is fine
        console.log('No existing analysis found');
        
        // In development, create mock analysis data
        if (process.env.NODE_ENV === 'development' || process.env.REACT_APP_USE_MOCK_DATA === 'true') {
          setAnalysis({
            productId: id,
            scores: {
              overall: 8.5,
              carbon: 8.2,
              water: 9.0,
              resources: 8.3
            },
            explanation: 'This product uses environmentally sustainable materials and manufacturing processes, resulting in a lower carbon footprint compared to conventional alternatives.',
            suggestions: '1. Consider recyclable packaging options.\n2. Explore carbon-neutral shipping methods.\n3. Implement a take-back program for end-of-life recycling.',
            createdAt: new Date().toISOString()
          });
        }
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
      const response = await analysisAPI.analyzeExistingProduct(id, true);
      setAnalysis(response.data);
      setAnalyzing(false);
    } catch (err) {
      console.error('Error analyzing product:', err);
      setAnalysisError(err.message || 'Failed to analyze product. Please try again.');
      
      // In development, create mock analysis data
      if (process.env.NODE_ENV === 'development' || process.env.REACT_APP_USE_MOCK_DATA === 'true') {
        // Simulate some delay for realistic experience
        setTimeout(() => {
          setAnalysis({
            productId: id,
            scores: {
              overall: 8.5,
              carbon: 8.2,
              water: 9.0,
              resources: 8.3
            },
            explanation: 'This product uses environmentally sustainable materials and manufacturing processes, resulting in a lower carbon footprint compared to conventional alternatives.',
            suggestions: '1. Consider recyclable packaging options.\n2. Explore carbon-neutral shipping methods.\n3. Implement a take-back program for end-of-life recycling.',
            createdAt: new Date().toISOString()
          });
          setAnalyzing(false);
          setAnalysisError(''); // Clear error since we have fallback data
        }, 2000);
      } else {
        setAnalyzing(false);
      }
    }
  };
  
  // Loading state
  if (loading) {
    return <LoadingState message="Loading product details..." fullPage />;
  }
  
  // Error state
  if (error && !product) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <ErrorState 
          error={error} 
          fullPage 
          onRetry={() => window.location.reload()}
        />
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            startIcon={<NavigateNextIcon />}
            onClick={() => navigate('/search')}
          >
            Back to Search
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
                src={getProductImage(id) || product.image_url} 
                alt={product.name} 
                style={{ width: '100%', height: 'auto' }} 
                onError={(e) => {
                  console.error(`Failed to load image for: ${product.name}`);
                  e.target.src = generateColorfulPlaceholder(product.name);
                }}
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
                Made in {product.manufacturing_location || product.manufacturingLocation || 'Not specified'}
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
              {(product.materials || []).map((material, index) => (
                <Chip 
                  key={index} 
                  label={material} 
                  size="small" 
                  variant="outlined" 
                  icon={<ConstructionIcon />} 
                />
              ))}
            </Box>
            
            {product.additional_details && (
              <>
                <Typography variant="h6" gutterBottom>
                  Additional Details
                </Typography>
                <Typography variant="body1" paragraph>
                  {product.additional_details}
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
                        Analysis performed: {formatDate(analysis.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        )}
        
{/* Similar Products section has been removed */}
      </Container>
    </Box>
  );
}

export default ProductDetailPage;