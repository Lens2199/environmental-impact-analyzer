import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  LinearProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EcoIcon from '@mui/icons-material/Eco';
import ShareIcon from '@mui/icons-material/Share';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import AddIcon from '@mui/icons-material/Add';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { productAPI, analysisAPI } from '../services/api';

// Component to display score with bar
const ScoreBar = ({ score, label, productIndex = 0 }) => {
  let color = '';
  
  if (score >= 9) color = '#43a047'; // excellent
  else if (score >= 7) color = '#7cb342'; // good
  else if (score >= 5) color = '#fdd835'; // average
  else if (score >= 3) color = '#fb8c00'; // poor
  else color = '#e53935'; // bad
  
  // Offset the bars slightly for better visualization
  const offsetPercentage = productIndex * 2;
  
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2">{label}</Typography>
        <Typography variant="body2" fontWeight="bold">{score}/10</Typography>
      </Box>
      <Box sx={{ position: 'relative', height: 20 }}>
        <LinearProgress
          variant="determinate"
          value={score * 10}
          sx={{
            height: 20,
            borderRadius: 1,
            backgroundColor: 'rgba(0,0,0,0.1)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: color,
              transition: 'transform 0.8s ease-in-out',
            },
            mt: `${offsetPercentage}px`,
          }}
        />
      </Box>
    </Box>
  );
};

function ComparisonPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const productIds = queryParams.get('products') ? queryParams.get('products').split(',') : [];
  
  const [products, setProducts] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comparison, setComparison] = useState(null);
  
  // Mock data for display purposes
  const mockProducts = [
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
      name: 'Fairphone 4',
      category: 'Electronics',
      description: 'A modular, repairable smartphone designed to last longer and reduce electronic waste.',
      materials: ['Aluminum', 'Fair Trade Gold', 'Recycled Plastic'],
      manufacturingLocation: 'Netherlands',
      imageUrl: 'https://via.placeholder.com/300x200?text=Fairphone+4'
    },
    {
      _id: '3',
      name: 'Standard Smartphone X',
      category: 'Electronics',
      description: 'A conventional smartphone with standard materials and manufacturing processes.',
      materials: ['Aluminum', 'Plastic', 'Glass', 'Rare Earth Metals'],
      manufacturingLocation: 'China',
      imageUrl: 'https://via.placeholder.com/300x200?text=Standard+Phone'
    }
  ];
  
  const mockAnalyses = [
    {
      _id: 'a1',
      product: '1',
      scores: { carbon: 8, water: 7, resources: 9, overall: 8 },
      explanation: 'This smartphone demonstrates strong environmental credentials through its use of recycled materials and modular design for repairability.'
    },
    {
      _id: 'a2',
      product: '2',
      scores: { carbon: 7, water: 8, resources: 9, overall: 8 },
      explanation: 'The modular design and fair trade materials make this a highly sustainable option with excellent repairability.'
    },
    {
      _id: 'a3',
      product: '3',
      scores: { carbon: 4, water: 5, resources: 3, overall: 4 },
      explanation: 'Standard manufacturing processes and non-recycled materials result in higher environmental impact.'
    }
  ];
  
  // Fetch product and analysis data
  useEffect(() => {
    const fetchData = async () => {
      if (productIds.length === 0) {
        setError('No products selected for comparison.');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError('');
      
      try {
        // In a real implementation, we would fetch products from API:
        /*
        const productPromises = productIds.map(id => productAPI.getProductById(id));
        const productResponses = await Promise.all(productPromises);
        const fetchedProducts = productResponses.map(response => response.data);
        setProducts(fetchedProducts);
        
        // Then fetch or generate analyses:
        const analysisPromises = productIds.map(id => analysisAPI.getAnalysisById(id));
        const analysisResponses = await Promise.all(analysisPromises);
        const fetchedAnalyses = analysisResponses.map(response => response.data);
        setAnalyses(fetchedAnalyses);
        
        // Generate comparison data
        const comparisonResponse = await analysisAPI.compareProducts(productIds);
        setComparison(comparisonResponse.data);
        */
        
        // For demonstration purposes, use mock data
        setTimeout(() => {
          // Filter mock data based on the productIds from URL
          const filteredProducts = mockProducts.filter(p => productIds.includes(p._id));
          const filteredAnalyses = mockAnalyses.filter(a => productIds.includes(a.product));
          
          setProducts(filteredProducts);
          setAnalyses(filteredAnalyses);
          
          // Generate mock comparison summary
          const mockComparison = {
            bestProduct: {
              id: '1',
              name: 'Eco-Friendly Smartphone',
              score: 8
            },
            averageScores: {
              carbon: filteredAnalyses.reduce((sum, a) => sum + a.scores.carbon, 0) / filteredAnalyses.length,
              water: filteredAnalyses.reduce((sum, a) => sum + a.scores.water, 0) / filteredAnalyses.length,
              resources: filteredAnalyses.reduce((sum, a) => sum + a.scores.resources, 0) / filteredAnalyses.length,
              overall: filteredAnalyses.reduce((sum, a) => sum + a.scores.overall, 0) / filteredAnalyses.length
            }
          };
          
          setComparison(mockComparison);
          setLoading(false);
        }, 1500);
        
      } catch (err) {
        console.error('Error fetching comparison data:', err);
        setError('Failed to load comparison data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [productIds]);
  
  // Handle removing a product from comparison
  const handleRemoveProduct = (productId) => {
    const updatedProductIds = productIds.filter(id => id !== productId);
    
    if (updatedProductIds.length < 2) {
      // Redirect to product page if only one product left
      if (updatedProductIds.length === 1) {
        navigate(`/products/${updatedProductIds[0]}`);
      } else {
        navigate('/search');
      }
    } else {
      navigate(`/compare?products=${updatedProductIds.join(',')}`);
    }
  };
  
  // Handle adding another product
  const handleAddProduct = () => {
    navigate('/search');
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
          startIcon={<CompareArrowsIcon />}
          onClick={() => navigate('/search')}
        >
          Select Products to Compare
        </Button>
      </Container>
    );
  }
  
  return (
    <Box className="page-transition">
      {/* Header */}
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
          <Typography variant="h6" sx={{ mb: 4, textAlign: 'center' }}>
            Compare environmental impact and features of selected products
          </Typography>
        </Container>
      </Box>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Comparison Summary */}
        {comparison && (
          <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Comparison Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <CheckCircleIcon sx={{ color: 'success.main', mr: 1, verticalAlign: 'middle' }} />
                      Most Environmentally Friendly Option
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body1" sx={{ mr: 1 }}>
                        {comparison.bestProduct.name}
                      </Typography>
                      <Chip 
                        label={`Score: ${comparison.bestProduct.score}/10`} 
                        color="primary" 
                        size="small" 
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Average Environmental Scores
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>Carbon Footprint:</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {comparison.averageScores.carbon.toFixed(1)}/10
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>Water Usage:</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {comparison.averageScores.water.toFixed(1)}/10
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>Resource Use:</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {comparison.averageScores.resources.toFixed(1)}/10
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>Overall Score:</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {comparison.averageScores.overall.toFixed(1)}/10
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        )}
        
        {/* Products Grid */}
        <Grid container spacing={3}>
          {products.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Paper 
                elevation={2} 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                {/* Close Button */}
                <IconButton
                  size="small"
                  sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8, 
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                    }
                  }}
                  onClick={() => handleRemoveProduct(product._id)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
                
                {/* Product Image */}
                <Box sx={{ position: 'relative' }}>
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    style={{ width: '100%', height: 'auto' }} 
                  />
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '4px 12px',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="body2">
                      {product.name}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Product Details */}
                <Box sx={{ p: 2, flexGrow: 1 }}>
                  {/* Find the corresponding analysis */}
                  {analyses.find(a => a.product === product._id) ? (
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        Environmental Scores
                      </Typography>
                      
                      {Object.entries({
                        'Carbon Footprint': analyses.find(a => a.product === product._id).scores.carbon,
                        'Water Usage': analyses.find(a => a.product === product._id).scores.water,
                        'Resource Consumption': analyses.find(a => a.product === product._id).scores.resources,
                        'Overall': analyses.find(a => a.product === product._id).scores.overall
                      }).map(([label, score]) => (
                        <ScoreBar 
                          key={label} 
                          label={label} 
                          score={score} 
                          productIndex={index}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Typography variant="body1" color="text.secondary">
                        No analysis available
                      </Typography>
                      <Button 
                        variant="contained" 
                        size="small" 
                        sx={{ mt: 1 }}
                        onClick={() => navigate(`/analyze?productId=${product._id}`)}
                      >
                        Analyze Now
                      </Button>
                    </Box>
                  )}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Product Details
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Category:</strong> {product.category}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Materials:</strong> {product.materials.join(', ')}
                  </Typography>
                  
                  <Typography variant="body2">
                    <strong>Made in:</strong> {product.manufacturingLocation}
                  </Typography>
                </Box>
                
                {/* Action Buttons */}
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    onClick={() => navigate(`/products/${product._id}`)}
                    sx={{ mb: 1 }}
                  >
                    View Details
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
          
          {/* Add Product Card */}
          {products.length < 3 && (
            <Grid item xs={12} sm={6} md={4}>
              <Paper 
                elevation={1} 
                sx={{ 
                  height: '100%',
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 3,
                  bgcolor: 'background.paper',
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'rgba(46,125,50,0.04)',
                  }
                }}
                onClick={handleAddProduct}
              >
                <AddIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" align="center" gutterBottom>
                  Add Another Product
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary">
                  Compare up to 3 products at once
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
        
        {/* Comparison Table */}
        {products.length > 1 && (
          <Paper elevation={3} sx={{ mt: 6, mb: 4, borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ px: 3, py: 2, backgroundColor: 'primary.main', color: 'white' }}>
              <Typography variant="h5">
                Detailed Comparison
              </Typography>
            </Box>
            
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Feature</TableCell>
                    {products.map(product => (
                      <TableCell key={product._id} align="center" sx={{ fontWeight: 'bold' }}>
                        {product.name}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Category */}
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Category
                    </TableCell>
                    {products.map(product => (
                      <TableCell key={product._id} align="center">
                        {product.category}
                      </TableCell>
                    ))}
                  </TableRow>
                  
                  {/* Materials */}
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Materials
                    </TableCell>
                    {products.map(product => (
                      <TableCell key={product._id} align="center">
                        {product.materials.join(', ')}
                      </TableCell>
                    ))}
                  </TableRow>
                  
                  {/* Manufacturing Location */}
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Manufacturing Location
                    </TableCell>
                    {products.map(product => (
                      <TableCell key={product._id} align="center">
                        {product.manufacturingLocation}
                      </TableCell>
                    ))}
                  </TableRow>
                  
                  {/* Overall Environmental Score */}
                  <TableRow sx={{ backgroundColor: 'rgba(46,125,50,0.1)' }}>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EcoIcon sx={{ mr: 1, color: 'primary.main' }} />
                        Overall Environmental Score
                      </Box>
                    </TableCell>
                    {products.map(product => {
                      const analysis = analyses.find(a => a.product === product._id);
                      const score = analysis ? analysis.scores.overall : 'N/A';
                      let bgColor = '';
                      
                      if (score >= 9) bgColor = 'rgba(67, 160, 71, 0.2)'; // excellent - green
                      else if (score >= 7) bgColor = 'rgba(124, 179, 66, 0.2)'; // good - light green
                      else if (score >= 5) bgColor = 'rgba(253, 216, 53, 0.2)'; // average - yellow
                      else if (score >= 3) bgColor = 'rgba(251, 140, 0, 0.2)'; // poor - orange
                      else if (score !== 'N/A') bgColor = 'rgba(229, 57, 53, 0.2)'; // bad - red
                      
                      return (
                        <TableCell 
                          key={product._id} 
                          align="center"
                          sx={{ 
                            fontWeight: 'bold', 
                            backgroundColor: bgColor,
                            fontSize: '1.1rem'
                          }}
                        >
                          {score !== 'N/A' ? `${score}/10` : 'Not Analyzed'}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  
                  {/* Carbon Footprint */}
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Carbon Footprint Score
                    </TableCell>
                    {products.map(product => {
                      const analysis = analyses.find(a => a.product === product._id);
                      return (
                        <TableCell key={product._id} align="center">
                          {analysis ? `${analysis.scores.carbon}/10` : 'N/A'}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  
                  {/* Water Usage */}
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Water Usage Score
                    </TableCell>
                    {products.map(product => {
                      const analysis = analyses.find(a => a.product === product._id);
                      return (
                        <TableCell key={product._id} align="center">
                          {analysis ? `${analysis.scores.water}/10` : 'N/A'}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  
                  {/* Resource Consumption */}
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Resource Consumption Score
                    </TableCell>
                    {products.map(product => {
                      const analysis = analyses.find(a => a.product === product._id);
                      return (
                        <TableCell key={product._id} align="center">
                          {analysis ? `${analysis.scores.resources}/10` : 'N/A'}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
        
        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EcoIcon />}
            onClick={() => navigate('/search')}
          >
            Find More Eco-Friendly Products
          </Button>
          
          <Tooltip title="Share this comparison">
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Comparison link copied to clipboard!');
              }}
            >
              Share
            </Button>
          </Tooltip>
        </Box>
      </Container>
    </Box>
  );
}

export default ComparisonPage;