import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Chip,
  Link as MuiLink
} from '@mui/material';
import { Link } from 'react-router-dom';
import EcoIcon from '@mui/icons-material/Eco';
import RecyclingIcon from '@mui/icons-material/Recycling';
import WaterIcon from '@mui/icons-material/Water';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import InventoryIcon from '@mui/icons-material/Inventory';
import SearchIcon from '@mui/icons-material/Search';
import SpaIcon from '@mui/icons-material/Spa';
import FactoryIcon from '@mui/icons-material/Factory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

/**
 * Page with sustainability guides and recommendations
 */
function SustainabilityGuidePage() {
  // State for active tab
  const [activeTab, setActiveTab] = useState(0);
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // In a real application, this would filter the content
    console.log('Search query:', searchQuery);
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
            Sustainability Guide
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, textAlign: 'center' }}>
            Practical recommendations for making more sustainable product choices
          </Typography>
          
          {/* Search Bar */}
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
              placeholder="Search sustainability tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ 
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { border: "none" },
                }
              }}
              size="small"
            />
            <Button 
              type="submit" 
              variant="contained"
              sx={{ ml: 1 }}
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
          </Box>
        </Container>
      </Box>
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Category Tabs */}
        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<EcoIcon />} label="OVERVIEW" />
            <Tab icon={<RecyclingIcon />} label="MATERIALS" />
            <Tab icon={<WaterIcon />} label="WATER USAGE" />
            <Tab icon={<EnergySavingsLeafIcon />} label="ENERGY" />
            <Tab icon={<InventoryIcon />} label="PACKAGING" />
            <Tab icon={<LocalShippingIcon />} label="TRANSPORTATION" />
          </Tabs>
        </Paper>
        
        {/* Tab Content */}
        <TabPanel value={activeTab} index={0}>
          <OverviewContent />
        </TabPanel>
        
        <TabPanel value={activeTab} index={1}>
          <MaterialsContent />
        </TabPanel>
        
        <TabPanel value={activeTab} index={2}>
          <WaterContent />
        </TabPanel>
        
        <TabPanel value={activeTab} index={3}>
          <EnergyContent />
        </TabPanel>
        
        <TabPanel value={activeTab} index={4}>
          <PackagingContent />
        </TabPanel>
        
        <TabPanel value={activeTab} index={5}>
          <TransportationContent />
        </TabPanel>
        
        {/* Call to Action */}
        <Box
          sx={{
            mt: 6,
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
            backgroundColor: 'primary.main',
            color: 'white',
          }}
          className="eco-gradient-bg"
        >
          <Typography variant="h5" gutterBottom>
            Ready to analyze your products?
          </Typography>
          <Typography variant="body1" paragraph>
            Start using the Environmental Impact Analyzer to make more sustainable choices.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/analyze"
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
        </Box>
      </Container>
    </Box>
  );
}

/**
 * TabPanel component for switching between content
 */
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`sustainability-tabpanel-${index}`}
      aria-labelledby={`sustainability-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

/**
 * Content for the Overview tab
 */
function OverviewContent() {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={8}>
        <Typography variant="h4" gutterBottom>
          Sustainable Product Guide
        </Typography>
        <Typography variant="body1" paragraph>
          Making environmentally friendly product choices is a powerful way to reduce your carbon footprint and support sustainable practices. This guide provides practical recommendations for evaluating products across different environmental impact categories.
        </Typography>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          Key Environmental Impact Categories
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
              <RecyclingIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6" gutterBottom>Carbon Footprint</Typography>
                <Typography variant="body2">
                  The total greenhouse gas emissions caused during a product's lifecycle.
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
              <WaterIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6" gutterBottom>Water Usage</Typography>
                <Typography variant="body2">
                  The water consumption and impact on water resources throughout production.
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
              <SpaIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6" gutterBottom>Resource Consumption</Typography>
                <Typography variant="body2">
                  The raw materials used, their sustainability, and resource efficiency.
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
              <LocalShippingIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6" gutterBottom>Transportation</Typography>
                <Typography variant="body2">
                  The environmental impact of shipping products from manufacturer to consumer.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          How to Use This Guide
        </Typography>
        <Typography variant="body1" paragraph>
          Navigate through the tabs to explore specific sustainability topics and recommendations. Each section provides practical advice for evaluating products and making more environmentally friendly choices.
        </Typography>
        <Typography variant="body1">
          You can also use our <MuiLink component={Link} to="/analyze">Product Analysis Tool</MuiLink> to get personalized recommendations for specific products based on AI-powered environmental impact assessment.
        </Typography>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card>
          <CardMedia
            component="img"
            height="200"
            image="https://via.placeholder.com/600x400?text=Sustainable+Choices"
            alt="Sustainable Choices"
          />
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Quick Facts
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <EcoIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Products with recycled content typically reduce carbon emissions by 30-70% compared to virgin materials."
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon>
                  <EcoIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Manufacturing a standard cotton t-shirt requires approximately 2,700 liters of water."
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon>
                  <EcoIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Products shipped by sea freight have a 95% lower carbon footprint than those shipped by air."
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon>
                  <EcoIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Biodegradable packaging can reduce landfill waste by up to 80% compared to traditional packaging."
                />
              </ListItem>
            </List>
            
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              component={Link}
              to="/analyze"
              sx={{ mt: 2 }}
            >
              Analyze a Product
            </Button>
          </CardContent>
        </Card>
        
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Sustainable Product Categories
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            <Chip label="Electronics" color="primary" variant="outlined" component={Link} to="/search?category=Electronics" />
            <Chip label="Clothing" color="primary" variant="outlined" component={Link} to="/search?category=Clothing" />
            <Chip label="Food" color="primary" variant="outlined" component={Link} to="/search?category=Food" />
            <Chip label="Home Goods" color="primary" variant="outlined" component={Link} to="/search?category=Home+Goods" />
            <Chip label="Beauty" color="primary" variant="outlined" component={Link} to="/search?category=Beauty" />
            <Chip label="Automotive" color="primary" variant="outlined" component={Link} to="/search?category=Automotive" />
            <Chip label="Furniture" color="primary" variant="outlined" component={Link} to="/search?category=Furniture" />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

/**
 * Content for the Materials tab
 */
function MaterialsContent() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Sustainable Materials Guide
      </Typography>
      <Typography variant="body1" paragraph>
        The materials used in products have a significant impact on their environmental footprint. This guide helps you identify more sustainable material choices.
      </Typography>
      
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Preferred Materials
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <RecyclingIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Recycled Materials" 
                  secondary="Look for products made from recycled plastics, metals, paper, or textiles to reduce virgin resource extraction."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SpaIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Rapidly Renewable Materials" 
                  secondary="Bamboo, cork, hemp, and other fast-growing plants that can be harvested sustainably in short cycles."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EcoIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Organic and Natural Materials" 
                  secondary="Materials grown without synthetic pesticides or fertilizers, such as organic cotton or wool."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <FactoryIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Biodegradable Materials" 
                  secondary="Materials that break down naturally at the end of their life cycle, reducing landfill waste."
                />
              </ListItem>
            </List>
          </Paper>
          
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Certifications to Look For
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Chip label="FSC Certified" color="primary" sx={{ mb: 1 }} />
                <Typography variant="body2">
                  Ensures wood products come from responsibly managed forests.
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Chip label="GOTS Certified" color="primary" sx={{ mb: 1 }} />
                <Typography variant="body2">
                  Guarantees organic textiles meet environmental and social criteria.
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Chip label="Cradle to Cradle" color="primary" sx={{ mb: 1 }} />
                <Typography variant="body2">
                  Evaluates material health, recyclability, and manufacturing ethics.
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Chip label="Recycled Content" color="primary" sx={{ mb: 1 }} />
                <Typography variant="body2">
                  Verifies the percentage of recycled materials in a product.
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Materials to Avoid
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <RecyclingIcon color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary="Single-Use Plastics" 
                  secondary="Non-recyclable plastics that contribute to pollution and waste accumulation."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SpaIcon color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary="Materials with Harmful Chemicals" 
                  secondary="Products containing PVC, BPA, phthalates, or formaldehyde that can harm human health and the environment."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EcoIcon color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary="Unsustainably Harvested Materials" 
                  secondary="Wood, paper, or plant fibers sourced from endangered forests or through unsustainable practices."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <FactoryIcon color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary="Rare Earth Metals from Unethical Sources" 
                  secondary="Metals used in electronics that may be mined with poor environmental and labor practices."
                />
              </ListItem>
            </List>
          </Paper>
          
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Practical Tips
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <EcoIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Check product labels and manufacturer websites for material composition information."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EcoIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Look for higher percentages of recycled content in products."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EcoIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Prioritize materials that are both sustainably sourced and recyclable at end of life."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EcoIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Consider durability - longer-lasting products reduce material consumption over time."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EcoIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="For electronics, look for devices designed for repairability and upgradability."
                />
              </ListItem>
            </List>
            
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              component={Link}
              to="/analyze"
              sx={{ mt: 2 }}
            >
              Analyze Material Impact
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

/**
 * Content for the Water Usage tab
 */
function WaterContent() {
  // Simplified content - in a real app this would be more comprehensive
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Water Usage & Conservation
      </Typography>
      <Typography variant="body1" paragraph>
        Water is a precious resource used throughout product lifecycles. Understanding water usage helps identify more sustainable options.
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <WaterIcon color="primary" sx={{ mr: 1 }} />
              Water Footprint Facts
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Cotton Clothing"
                  secondary="A single cotton t-shirt can require 2,700 liters of water to produce, from cotton farming to final processing."
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Electronics"
                  secondary="Manufacturing a smartphone uses approximately 13,000 liters of water throughout its production process."
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Food Products"
                  secondary="1kg of beef requires about 15,400 liters of water, while 1kg of vegetables needs only about 300 liters."
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Paper Products"
                  secondary="A single sheet of paper requires about 10 liters of water to produce."
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <WaterIcon color="primary" sx={{ mr: 1 }} />
              Choosing Water-Efficient Products
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <EcoIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Look for products with water-saving certifications"
                  secondary="Water Sense, GOTS for textiles, or other water efficiency labels."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EcoIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Choose recycled materials"
                  secondary="Products made from recycled materials typically use 50-90% less water than those made from virgin materials."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EcoIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Prioritize companies with water management programs"
                  secondary="Look for brands that disclose their water usage and have implemented water reduction strategies."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EcoIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Consider geographic origin"
                  secondary="Products manufactured in water-stressed regions may have a higher environmental impact."
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
      
      <Card sx={{ mt: 4 }}>
        <Grid container>
          <Grid item xs={12} md={4}>
            <CardMedia
              component="img"
              height="100%"
              image="https://via.placeholder.com/400x300?text=Water+Conservation"
              alt="Water Conservation"
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Water Impact Analysis
              </Typography>
              <Typography variant="body1" paragraph>
                Our Environmental Impact Analyzer evaluates products' water usage across their lifecycle, from raw material extraction to manufacturing and distribution.
              </Typography>
              <Typography variant="body1" paragraph>
                By understanding water consumption patterns, you can make more informed choices and support products and companies that prioritize water conservation.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                to="/analyze"
              >
                Analyze Water Impact
              </Button>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}

/**
 * Content for other tabs
 * In a real implementation, these would be fully developed
 */
function EnergyContent() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Energy & Carbon Footprint
      </Typography>
      <Typography variant="body1">
        This section would contain comprehensive information about energy usage and carbon footprint in product lifecycles.
      </Typography>
      {/* Additional content would be added in a real implementation */}
    </Box>
  );
}

function PackagingContent() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Sustainable Packaging
      </Typography>
      <Typography variant="body1">
        This section would contain comprehensive information about sustainable packaging options and their environmental impact.
      </Typography>
      {/* Additional content would be added in a real implementation */}
    </Box>
  );
}

function TransportationContent() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Transportation & Shipping
      </Typography>
      <Typography variant="body1">
        This section would contain comprehensive information about the environmental impact of product transportation and shipping methods.
      </Typography>
      {/* Additional content would be added in a real implementation */}
    </Box>
  );
}

export default SustainabilityGuidePage;