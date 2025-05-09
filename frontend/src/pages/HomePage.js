import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  CardActions,
  Divider
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import EcoIcon from '@mui/icons-material/Eco';
import RecyclingIcon from '@mui/icons-material/Recycling';
import WaterIcon from '@mui/icons-material/Water';
import SpaIcon from '@mui/icons-material/Spa';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Dashboard from '../components/dashboard/Dashboard';

function HomePage() {
  return (
    <Box className="page-transition">
      {/* Hero Section */}
      <Box
        sx={{
          pt: 8,
          pb: 6,
          backgroundColor: 'primary.main',
          color: 'white',
          textAlign: 'center',
        }}
        className="eco-gradient-bg"
      >
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h2"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Environmental Impact Analyzer
          </Typography>
          <Typography variant="h5" paragraph sx={{ mb: 4 }}>
            Make sustainable choices with our AI-powered analysis of product environmental impact
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                size="large"
                component={RouterLink}
                to="/analyze"
                startIcon={<AnalyticsIcon />}
                sx={{ 
                  backgroundColor: 'white', 
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)',
                  }
                }}
              >
                Analyze a Product
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                size="large"
                component={RouterLink}
                to="/search"
                startIcon={<SearchIcon />}
                sx={{ 
                  borderColor: 'white', 
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                Search Products
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Dashboard Section */}
      <Container sx={{ py: 6 }} maxWidth="lg">
        <Typography variant="h4" textAlign="center" gutterBottom>
          Your Sustainability Dashboard
        </Typography>
        <Typography variant="body1" textAlign="center" paragraph sx={{ mb: 4 }}>
          Track and analyze the environmental impact of various products
        </Typography>
        
        <Dashboard />

        <Divider sx={{ my: 6 }} />
        
        {/* Features Section */}
        <Typography variant="h4" textAlign="center" gutterBottom>
          How It Works
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          Our platform uses advanced AI to analyze product information and determine environmental impact
        </Typography>
        
        <Grid container spacing={4}>
          {/* Feature 1 */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }} className="product-card">
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <SearchIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              </Box>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2" textAlign="center">
                  Search Products
                </Typography>
                <Typography color="text.secondary">
                  Find products in our database or add new ones for analysis. Browse products by category or search by name.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Feature 2 */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }} className="product-card">
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <AnalyticsIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              </Box>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2" textAlign="center">
                  AI Analysis
                </Typography>
                <Typography color="text.secondary">
                  Our AI analyzes product descriptions, materials, manufacturing details, and supply chain information.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Feature 3 */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }} className="product-card">
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <EcoIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              </Box>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2" textAlign="center">
                  Impact Scores
                </Typography>
                <Typography color="text.secondary">
                  Get detailed environmental impact scores across multiple categories and understand product sustainability.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Feature 4 */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }} className="product-card">
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <CompareArrowsIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              </Box>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2" textAlign="center">
                  Compare Products
                </Typography>
                <Typography color="text.secondary">
                  Compare similar products to find the most environmentally friendly option for your needs.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Impact Categories Section */}
      <Box sx={{ py: 8, backgroundColor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" gutterBottom>
            Environmental Impact Categories
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
            Our analysis considers multiple environmental factors
          </Typography>
          
          <Grid container spacing={4}>
            {/* Category 1 */}
            <Grid item xs={12} md={4}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardMedia
                  component="div"
                  sx={{
                    pt: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <RecyclingIcon sx={{ fontSize: 80, color: 'primary.main' }} />
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2" textAlign="center">
                    Carbon Footprint
                  </Typography>
                  <Typography>
                    We assess the total greenhouse gas emissions caused during a product's lifecycle, including production, transportation, and disposal.
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button size="small" component={RouterLink} to="/guide">Learn More</Button>
                </CardActions>
              </Card>
            </Grid>
            
            {/* Category 2 */}
            <Grid item xs={12} md={4}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardMedia
                  component="div"
                  sx={{
                    pt: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <WaterIcon sx={{ fontSize: 80, color: 'primary.main' }} />
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2" textAlign="center">
                    Water Usage
                  </Typography>
                  <Typography>
                    We evaluate the water consumption throughout the production process, considering both quantity and impact on local water resources.
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button size="small" component={RouterLink} to="/guide">Learn More</Button>
                </CardActions>
              </Card>
            </Grid>
            
            {/* Category 3 */}
            <Grid item xs={12} md={4}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardMedia
                  component="div"
                  sx={{
                    pt: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <SpaIcon sx={{ fontSize: 80, color: 'primary.main' }} />
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2" textAlign="center">
                    Resource Consumption
                  </Typography>
                  <Typography>
                    We analyze the raw materials used, their sustainability, and the efficiency of resource use in manufacturing and packaging.
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button size="small" component={RouterLink} to="/guide">Learn More</Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Guide Section */}
      <Container sx={{ py: 8 }} maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" gutterBottom>
              Sustainability Guide
            </Typography>
            <Typography variant="body1" paragraph>
              Our comprehensive sustainability guide provides practical recommendations for evaluating products across different environmental impact categories.
            </Typography>
            <Typography variant="body1" paragraph>
              Learn about sustainable materials, water conservation, energy efficiency, and more to make better-informed purchasing decisions.
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={RouterLink}
              to="/guide"
              startIcon={<MenuBookIcon />}
              sx={{ mt: 2 }}
            >
              Explore the Guide
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image="https://via.placeholder.com/600x300?text=Sustainability+Guide"
                alt="Sustainability Guide"
              />
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Call to Action Section */}
      <Box
        sx={{
          py: 6,
          backgroundColor: 'primary.main',
          color: 'white',
          textAlign: 'center',
        }}
        className="eco-gradient-bg"
      >
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom>
            Ready to make more sustainable choices?
          </Typography>
          <Typography variant="h6" paragraph sx={{ mb: 4 }}>
            Start analyzing products today and discover their environmental impact.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/analyze"
            sx={{ 
              backgroundColor: 'white', 
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)',
              }
            }}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
}

export default HomePage;