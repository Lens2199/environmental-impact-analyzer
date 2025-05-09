import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress
} from '@mui/material';
import EcoIcon from '@mui/icons-material/Eco';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import InventoryIcon from '@mui/icons-material/Inventory';
import ScoreDisplay from '../analysis/ScoreDisplay';
import { useAppContext } from '../../context/AppContext';
import { formatRelativeTime, truncateText } from '../../utils/helpers';
import { productAPI, analysisAPI } from '../../services/api';

/**
 * Dashboard component displaying recent analyses, popular products, and key metrics
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const { recentAnalyses, loadingAnalyses, fetchRecentAnalyses } = useAppContext();
  
  // Local state for popular products
  const [popularProducts, setPopularProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  
  // Fetch popular products
  useEffect(() => {
    const fetchPopularProducts = async () => {
      setLoadingProducts(true);
      try {
        // In a real application, this would call an endpoint to get popular products
        // For now, we'll simulate with the regular products endpoint
        const response = await productAPI.getAllProducts();
        setPopularProducts(response.data.slice(0, 3)); // Take first 3 products
      } catch (error) {
        console.error('Error fetching popular products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };
    
    fetchPopularProducts();
  }, []);
  
  // Calculate summary metrics
  const metrics = {
    totalAnalyses: recentAnalyses.length,
    avgOverallScore: recentAnalyses.length > 0 
      ? (recentAnalyses.reduce((sum, analysis) => sum + analysis.scores.overall, 0) / recentAnalyses.length).toFixed(1)
      : 'N/A',
    mostSustainableProduct: recentAnalyses.length > 0 
      ? recentAnalyses.reduce((prev, current) => 
          (prev.scores.overall > current.scores.overall) ? prev : current
        ).product
      : null
  };
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Summary Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              height: '100%'
            }}
          >
            <AnalyticsIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" component="div" gutterBottom>
              {loadingAnalyses ? <CircularProgress size={30} /> : metrics.totalAnalyses}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Total Analyses
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              height: '100%'
            }}
          >
            <EcoIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" component="div" gutterBottom>
              {loadingAnalyses ? <CircularProgress size={30} /> : metrics.avgOverallScore}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Average Sustainability Score
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              height: '100%',
              cursor: metrics.mostSustainableProduct ? 'pointer' : 'default'
            }}
            onClick={() => {
              if (metrics.mostSustainableProduct) {
                navigate(`/products/${metrics.mostSustainableProduct._id}`);
              }
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" component="div" align="center" gutterBottom>
              {loadingAnalyses ? (
                <CircularProgress size={30} />
              ) : metrics.mostSustainableProduct ? (
                metrics.mostSustainableProduct.name
              ) : (
                'No Products Analyzed'
              )}
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center">
              Most Sustainable Product
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Recent Analyses and Popular Products */}
      <Grid container spacing={3}>
        {/* Recent Analyses */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ height: '100%' }}>
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h6">
                Recent Analyses
              </Typography>
            </Box>
            
            <Box sx={{ p: 2 }}>
              {loadingAnalyses ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : recentAnalyses.length > 0 ? (
                <List>
                  {recentAnalyses.slice(0, 5).map((analysis, index) => (
                    <React.Fragment key={analysis._id || index}>
                      {index > 0 && <Divider component="li" />}
                      <ListItem 
                        alignItems="flex-start"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => {
                          if (analysis.product) {
                            navigate(`/products/${analysis.product._id}`);
                          } else {
                            navigate(`/analysis/${analysis._id}`);
                          }
                        }}
                      >
                        <ListItemIcon>
                          <ScoreDisplay 
                            score={analysis.scores.overall}
                            label=""
                            size="small"
                            showLabel={false}
                            showProgress={false}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1">
                              {analysis.product ? analysis.product.name : 'Custom Analysis'}
                            </Typography>
                          }
                          secondary={
                            <React.Fragment>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                component="span"
                              >
                                {truncateText(analysis.explanation, 100)}
                              </Typography>
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  {formatRelativeTime(analysis.createdAt)}
                                </Typography>
                              </Box>
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    No analyses found.
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigate('/analyze')}
                  >
                    Analyze a Product
                  </Button>
                </Box>
              )}
            </Box>
            
            {recentAnalyses.length > 0 && (
              <Box sx={{ p: 2, pt: 0, textAlign: 'right' }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/analyze')}
                  endIcon={<AnalyticsIcon />}
                >
                  New Analysis
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Popular Products */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ height: '100%' }}>
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h6">
                Popular Products
              </Typography>
            </Box>
            
            <Box sx={{ p: 2 }}>
              {loadingProducts ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : popularProducts.length > 0 ? (
                <Grid container spacing={2}>
                  {popularProducts.map((product) => (
                    <Grid item xs={12} key={product._id}>
                      <Card>
                        <CardActionArea onClick={() => navigate(`/products/${product._id}`)}>
                          <Box sx={{ display: 'flex' }}>
                            <CardMedia
                              component="img"
                              sx={{ width: 100, height: 100, objectFit: 'cover' }}
                              image={product.imageUrl || `https://via.placeholder.com/100x100?text=${encodeURIComponent(product.name)}`}
                              alt={product.name}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" component="div">
                                {product.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {truncateText(product.description, 80)}
                              </Typography>
                              <Box sx={{ mt: 1 }}>
                                <Chip 
                                  size="small" 
                                  label={product.category} 
                                  color="primary" 
                                  variant="outlined" 
                                />
                              </Box>
                            </CardContent>
                          </Box>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    No products found.
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigate('/products/add')}
                  >
                    Add a Product
                  </Button>
                </Box>
              )}
            </Box>
            
            {popularProducts.length > 0 && (
              <Box sx={{ p: 2, pt: 0, textAlign: 'right' }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/search')}
                  endIcon={<InventoryIcon />}
                >
                  Browse Products
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Quick Actions */}
      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid item xs={12} sm={4}>
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            size="large"
            startIcon={<AnalyticsIcon />}
            onClick={() => navigate('/analyze')}
            sx={{ py: 2 }}
          >
            Analyze Product
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button 
            variant="contained" 
            color="secondary" 
            fullWidth 
            size="large"
            startIcon={<CompareArrowsIcon />}
            onClick={() => navigate('/compare')}
            sx={{ py: 2 }}
          >
            Compare Products
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button 
            variant="contained" 
            color="success" 
            fullWidth 
            size="large"
            startIcon={<EcoIcon />}
            onClick={() => navigate('/guide')}
            sx={{ py: 2 }}
          >
            Sustainability Guide
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;