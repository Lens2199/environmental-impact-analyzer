import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Chip,
  Tabs,
  Tab,
  LinearProgress
} from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import EcoIcon from '../components/icons/EcoIcon';
import WaterIcon from '@mui/icons-material/Water';
import SpaIcon from '@mui/icons-material/Spa';
import RecyclingIcon from '../components/icons/RecyclingIcon';  // Adjust path
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Replace the direct axios import with the API service
import { analysisAPI, productAPI } from '../services/api'; // Make sure path is correct

// Component for displaying individual score
const ScoreCircle = ({ score, label, icon }) => {
  let scoreClass = '';
  
  if (score >= 9) scoreClass = 'score-excellent';
  else if (score >= 7) scoreClass = 'score-good';
  else if (score >= 5) scoreClass = 'score-average';
  else if (score >= 3) scoreClass = 'score-poor';
  else scoreClass = 'score-bad';
  
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box 
        className={`analysis-score-circle ${scoreClass}`}
        sx={{ mb: 1 }}
      >
        {score}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
        {icon}
        <Typography variant="h6" component="div" sx={{ ml: 0.5 }}>
          {label}
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={score * 10} 
        sx={{ 
          height: 8, 
          borderRadius: 5,
          bgcolor: 'rgba(0,0,0,0.1)',
          '& .MuiLinearProgress-bar': {
            bgcolor: scoreClass === 'score-excellent' ? '#43a047' :
                    scoreClass === 'score-good' ? '#7cb342' :
                    scoreClass === 'score-average' ? '#fdd835' :
                    scoreClass === 'score-poor' ? '#fb8c00' : '#e53935'
          }
        }} 
      />
    </Box>
  );
};

function AnalysisPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [productText, setProductText] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [productDetails, setProductDetails] = useState(null);
  
  // Get product data from navigation state
  const { state } = location;
  const productFromState = state?.productData;
  const autoAnalyzeFromState = state?.autoAnalyze || false;
  
  // For backward compatibility, still check URL params
  const params = new URLSearchParams(location.search);
  const productId = params.get('productId');
  const autoStart = params.get('autoStart') === 'true' || autoAnalyzeFromState;
  
  // Function to fetch product details
  
  // Format product details into text for analysis
  const formatProductDetails = (product) => {
    if (!product) return '';
    
    let formattedText = `${product.name}\n\n`;
    
    if (product.category) {
      formattedText += `Category: ${product.category}\n\n`;
    }
    
    if (product.description) {
      formattedText += `Description: ${product.description}\n\n`;
    }
    
    if (Array.isArray(product.materials) && product.materials.length > 0) {
      formattedText += `Materials: ${product.materials.join(', ')}\n\n`;
    }
    
    if (product.manufacturingLocation) {
      formattedText += `Manufacturing Location: ${product.manufacturingLocation}\n\n`;
    }
    
    return formattedText.trim();
  };
  
  // Effect to handle auto-analysis for product coming from state or URL
  useEffect(() => {
    const handleAutoAnalysis = async () => {
      console.log('Checking for product data:', { productFromState, productId, autoStart });
      
      // If we have product data from navigation state
      if (productFromState) {
        console.log('Using product passed via navigation state:', productFromState);
        setProductDetails(productFromState);
        const formattedText = formatProductDetails(productFromState);
        console.log('Formatted product text:', formattedText);
        setProductText(formattedText);
        
        // Auto-trigger analysis if enabled
        if (autoAnalyzeFromState || autoStart) {
          console.log('Auto-starting analysis for product from state');
          setTimeout(() => {
            analyzeProduct(formattedText);
          }, 300);
        }
        return;
      }
      
      // Otherwise try to fetch by ID
      if (productId) {
        console.log('Auto-analysis triggered for product ID:', productId);
        console.log('Auto-start parameter:', autoStart);
        
        // Fetch product details
        try {
          setFetchingProduct(true);
          setError('');
          
          // Mock product details if API call fails in development
          let product;
          try {
            // Try to get product from API
            const response = await productAPI.getProductById(productId);
            product = response.data;
            console.log('Product details fetched:', product);
          } catch (apiError) {
            console.error('API error:', apiError);
            
            // If in development and API fails, use mock data based on the product ID
            if (process.env.NODE_ENV === 'development') {
              // Find the product from our mock list based on ID
              const mockProducts = [
                {
                  id: '1',
                  name: 'Eco-Friendly Smartphone',
                  category: 'Electronics',
                  description: 'Made with recycled materials and designed for easy repair and recycling at end of life.',
                  materials: ['Recycled Aluminum', 'Recycled Plastic', 'Glass'],
                  manufacturingLocation: 'Germany'
                },
                {
                  id: '2',
                  name: 'Organic Cotton T-Shirt',
                  category: 'Clothing',
                  description: 'Made with 100% organic cotton grown without harmful pesticides or synthetic fertilizers.',
                  materials: ['Organic Cotton'],
                  manufacturingLocation: 'Portugal'
                },
                {
                  id: '3',
                  name: 'Bamboo Kitchen Utensils',
                  category: 'Home Goods',
                  description: 'Sustainable bamboo kitchen utensils that are biodegradable and renewable.',
                  materials: ['Bamboo'],
                  manufacturingLocation: 'Vietnam'
                },
                {
                  id: '4',
                  name: 'Solar-Powered Power Bank',
                  category: 'Electronics',
                  description: 'Charge your devices using clean solar energy. Includes recycled components.',
                  materials: ['Recycled Plastic', 'Silicon', 'Lithium Battery'],
                  manufacturingLocation: 'China'
                },
                {
                  id: '5',
                  name: 'Plant-Based Laundry Detergent',
                  category: 'Home Goods',
                  description: 'Biodegradable laundry detergent made from plant-derived ingredients.',
                  materials: ['Plant Extracts', 'Natural Enzymes'],
                  manufacturingLocation: 'USA'
                },
                {
                  id: '6',
                  name: 'Recycled Paper Notebook',
                  category: 'Home Goods',
                  description: '100% recycled paper notebook with vegetable-based ink printing.',
                  materials: ['Recycled Paper', 'Vegetable Ink'],
                  manufacturingLocation: 'Canada'
                }
              ];
              
              product = mockProducts.find(p => p.id === productId);
              console.log('Using mock product data:', product);
            }
          }
          
          if (product) {
            setProductDetails(product);
            const formattedText = formatProductDetails(product);
            console.log('Formatted product text:', formattedText);
            setProductText(formattedText);
            
            // Auto-trigger analysis if autoStart is true
            if (autoStart && formattedText) {
              console.log('Auto-starting analysis for product');
              // Short delay to ensure state has updated
              setTimeout(() => {
                analyzeProduct(formattedText);
              }, 300);
            }
          } else {
            setError('Product not found. Please try entering product details manually.');
          }
        } finally {
          setFetchingProduct(false);
        }
      }
    };
    
    handleAutoAnalysis();
  }, [productFromState, autoAnalyzeFromState, productId, autoStart]); // Run when parameters change
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Extracted analysis logic to be reusable
  const analyzeProduct = async (text) => {
    if (!text.trim()) {
      setError('Please enter product details to analyze.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log('Starting analysis with text:', text);
      
      // Try to use the API service
      let analysisData;
      try {
        const response = await analysisAPI.analyzeProductText(text);
        analysisData = response.data;
        console.log('Analysis API response:', analysisData);
      } catch (apiError) {
        console.error('API error during analysis:', apiError);
        
        // If we're in development, generate mock data
        if (process.env.NODE_ENV === 'development') {
          console.log('Using mock analysis data in development');
          
          // Generate scores based on text content
          const materialScore = text.toLowerCase().includes('recycled') ? 8.5 : 6.0;
          const carbonScore = text.toLowerCase().includes('china') ? 5.8 : 7.4;
          const waterScore = text.toLowerCase().includes('organic') ? 8.7 : 6.5;
          
          // Calculate overall score as average of other scores
          const overallScore = Number(((materialScore + carbonScore + waterScore) / 3).toFixed(1));
          
          // Generate mock response
          analysisData = {
            scores: {
              overall: overallScore,
              carbon: carbonScore,
              water: waterScore,
              resources: materialScore
            },
            explanation: `This ${text.toLowerCase().includes('electronic') ? 'electronic' : 'consumer'} product has a moderate environmental impact. ${
              text.toLowerCase().includes('recycled') ? 'The use of recycled materials is commendable and reduces resource consumption.' : 'Consider using more recycled or sustainable materials in the product.'
            } ${
              text.toLowerCase().includes('china') ? 'Manufacturing in China increases the carbon footprint due to transportation distance and potentially higher emissions from energy sources.' : 'The manufacturing location provides reasonable proximity to markets, reducing transportation emissions.'
            } ${
              text.toLowerCase().includes('packaging') ? 'The packaging choices show attention to environmental concerns.' : 'No information on packaging was provided, which is an area for potential improvement.'
            }`,
            suggestions: `Consider sourcing materials from locations closer to manufacturing. Implement more renewable energy in the production process. Explore biodegradable packaging alternatives. ${
              text.toLowerCase().includes('recycled') ? 'Increase the percentage of recycled materials used.' : 'Incorporate recycled materials into the product design.'
            } ${
              text.toLowerCase().includes('plastic') ? 'Reduce plastic components or switch to bioplastics where possible.' : 'Ensure all materials are easily separable for recycling at end of life.'
            }`
          };
        } else {
          throw apiError; // Re-throw for non-development environments
        }
      }
      
      if (analysisData) {
        setAnalysis(analysisData);
      } else {
        throw new Error('No analysis data received');
      }
    } catch (err) {
      console.error('Error analyzing product:', err);
      setError(err.response?.data?.message || 'An error occurred while analyzing the product. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Form submission handler
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    await analyzeProduct(productText);
  };
  
  // Handle back button if product was passed from search
  const handleBack = () => {
    if (productId) {
      // Navigate back to the main page where ProductSearchPage is likely located
      navigate('/');
    }
  };
  
  return (
    <Box className="page-transition">
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
            Analyze Environmental Impact
          </Typography>
          <Typography variant="h6" paragraph sx={{ mb: 4, textAlign: 'center' }}>
            Enter product details to receive an AI-powered environmental impact assessment
          </Typography>
        </Container>
      </Box>
      
      <Container maxWidth="md" sx={{ py: 6 }}>
        {/* Back button if coming from product search */}
        {productId && (
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBack}
            sx={{ mb: 2 }}
          >
            Back to Products
          </Button>
        )}
        
        {/* Product information form */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Product Information
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Please provide as much detail as possible about the product for the most accurate assessment.
            Include information about materials, manufacturing process, packaging, and origin if available.
          </Typography>
          
          {/* Loading indicator when fetching product */}
          {fetchingProduct ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <TextField
                label="Product Details"
                multiline
                rows={6}
                fullWidth
                value={productText}
                onChange={(e) => setProductText(e.target.value)}
                placeholder="Example: This smartphone is made with an aluminum body, glass screen, and lithium-ion battery. It's manufactured in China and packaged in recycled cardboard with plastic film."
                sx={{ mb: 3 }}
                required
              />
              
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              
              {/* Modified button - removed loading indicator and fixed text */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<AnalyticsIcon />}
                disabled={loading || !productText.trim()}
                fullWidth
                sx={{ py: 1.5 }}
              >
                Analyze Product
              </Button>
            </form>
          )}
        </Paper>
        
        {/* Main loading indicator - kept this one */}
        {loading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Analyzing product details...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This may take a few moments as our AI evaluates the environmental impact.
            </Typography>
          </Box>
        )}
        
        {analysis && !loading && (
          <Card elevation={3} sx={{ mb: 4 }}>
            <Box sx={{ px: 3, py: 2, backgroundColor: 'primary.main', color: 'white' }}>
              <Typography variant="h5">
                Environmental Impact Analysis Results
              </Typography>
            </Box>
            
            <CardContent>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                centered
                sx={{ mb: 3 }}
              >
                <Tab icon={<AnalyticsIcon />} label="SCORES" />
                <Tab icon={<TipsAndUpdatesIcon />} label="INSIGHTS" />
              </Tabs>
              
              {activeTab === 0 && (
                <Box>
                  {/* Overall Score */}
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h4" gutterBottom>
                      Overall Environmental Score
                    </Typography>
                    <Box 
                      className={`analysis-score-circle ${
                        analysis.scores.overall >= 9 ? 'score-excellent' :
                        analysis.scores.overall >= 7 ? 'score-good' :
                        analysis.scores.overall >= 5 ? 'score-average' :
                        analysis.scores.overall >= 3 ? 'score-poor' : 'score-bad'
                      }`}
                      sx={{ width: 120, height: 120, fontSize: '2.5rem', mb: 2, mx: 'auto' }}
                    >
                      {analysis.scores.overall}
                    </Box>
                    <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto' }}>
                      {analysis.explanation.split('.')[0]}.
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 4 }} />
                  
                  {/* Individual Scores */}
                  <Box sx={{ my: 3 }}>
                    <Typography variant="h5" gutterBottom>
                      Environmental Impact Breakdown
                    </Typography>
                    <Grid container spacing={4} sx={{ mt: 2 }}>
                      <Grid item xs={12} md={4}>
                        <ScoreCircle 
                          score={analysis.scores.carbon} 
                          label="Carbon Footprint" 
                          icon={<RecyclingIcon sx={{ color: 'primary.main' }} />}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <ScoreCircle 
                          score={analysis.scores.water} 
                          label="Water Usage" 
                          icon={<WaterIcon sx={{ color: 'primary.main' }} />}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <ScoreCircle 
                          score={analysis.scores.resources} 
                          label="Resource Consumption" 
                          icon={<SpaIcon sx={{ color: 'primary.main' }} />}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              )}
              
              {activeTab === 1 && (
                <Box>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <EcoIcon sx={{ mr: 1, color: 'primary.main' }} />
                      Detailed Explanation
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.7 }}>
                      {analysis.explanation}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 4 }} />
                  
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <TipsAndUpdatesIcon sx={{ mr: 1, color: 'primary.main' }} />
                      Improvement Suggestions
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {analysis.suggestions.split('.').filter(s => s.trim()).map((suggestion, index) => (
                        <Alert 
                          key={index} 
                          severity="info" 
                          icon={<TipsAndUpdatesIcon />}
                          sx={{ mb: 2 }}
                        >
                          {suggestion.trim() + '.'}
                        </Alert>
                      ))}
                    </Box>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        )}
        
        {!productDetails && (
          <Paper elevation={1} sx={{ p: 3, bgcolor: 'background.paper', borderLeft: '4px solid', borderColor: 'primary.main' }}>
            <Typography variant="h6" gutterBottom>
              Tips for Accurate Analysis
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <Chip label="1" color="primary" size="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Include materials used in the product (metal, plastic, fabric types)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <Chip label="2" color="primary" size="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Mention manufacturing location and processes if known
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <Chip label="3" color="primary" size="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Describe packaging materials and product lifespan
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Chip label="4" color="primary" size="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Note any eco-certifications or sustainability claims
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Container>
    </Box>
  );
}

export default AnalysisPage;