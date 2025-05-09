import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Divider, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Button,
  Link as MuiLink
} from '@mui/material';
import { Link } from 'react-router-dom';
import EcoIcon from '@mui/icons-material/Eco';
import CodeIcon from '@mui/icons-material/Code';
import BoltIcon from '@mui/icons-material/Bolt';
import DataObjectIcon from '@mui/icons-material/DataObject';
import StorageIcon from '@mui/icons-material/Storage';
import CloudIcon from '@mui/icons-material/Cloud';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function AboutPage() {
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
            About This Project
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, textAlign: 'center' }}>
            Learn about the Environmental Impact Analyzer and its development
          </Typography>
        </Container>
      </Box>
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Project Overview */}
        <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
            Project Overview
          </Typography>
          <Typography variant="body1" paragraph>
            The Environmental Impact Analyzer is a full-stack web application designed to help consumers make more environmentally conscious 
            purchasing decisions. Using artificial intelligence, the tool analyzes product descriptions, materials, 
            manufacturing processes, and supply chain information to provide an environmental impact assessment.
          </Typography>
          <Typography variant="body1" paragraph>
            By providing clear, easy-to-understand environmental impact scores across multiple categories, the 
            application empowers users to compare products and choose options with lower environmental footprints.
            This project demonstrates the potential of AI to address real-world sustainability challenges and 
            promote eco-friendly consumer behavior.
          </Typography>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Key Features
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <AutoGraphIcon sx={{ mr: 1, color: 'primary.main' }} />
                      AI-Powered Analysis
                    </Typography>
                    <Typography variant="body2">
                      Utilizes advanced AI models to assess and score products based on their environmental impact,
                      processing natural language descriptions to extract key environmental indicators.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <EcoIcon sx={{ mr: 1, color: 'primary.main' }} />
                      Comprehensive Scoring
                    </Typography>
                    <Typography variant="body2">
                      Provides detailed environmental impact scores across multiple categories including carbon footprint,
                      water usage, and resource consumption, with explanations and improvement suggestions.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <BoltIcon sx={{ mr: 1, color: 'primary.main' }} />
                      Product Comparison
                    </Typography>
                    <Typography variant="body2">
                      Enables side-by-side comparison of multiple products to easily identify the most environmentally 
                      friendly options, with visual representations of differences in environmental impact.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Paper>
        
        {/* Tech Stack */}
        <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
            Technical Implementation
          </Typography>
          <Typography variant="body1" paragraph>
            This application demonstrates proficiency in modern full-stack development, AI integration, and 
            deployment best practices. Built with a focus on performance, scalability, and user experience,
            the project incorporates the following technologies:
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <CodeIcon sx={{ mr: 1, color: 'primary.main' }} />
                Frontend Development
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="React.js" 
                    secondary="Component-based UI library for building interactive user interfaces"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Material UI" 
                    secondary="React component library implementing Google's Material Design"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="React Router" 
                    secondary="Client-side routing for single-page application navigation"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Axios" 
                    secondary="Promise-based HTTP client for API requests"
                  />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <DataObjectIcon sx={{ mr: 1, color: 'primary.main' }} />
                Backend Development
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Node.js with Express" 
                    secondary="JavaScript runtime and web application framework for server-side development"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="MongoDB with Mongoose" 
                    secondary="NoSQL database and ODM for flexible data storage and management"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="OpenAI API" 
                    secondary="Integration with GPT models for natural language processing and analysis"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="REST API Architecture" 
                    secondary="Well-structured endpoints for client-server communication"
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 4 }} />
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <StorageIcon sx={{ mr: 1, color: 'primary.main' }} />
                Database & Data Management
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="MongoDB Atlas" 
                    secondary="Cloud database service for data storage"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Mongoose Schemas" 
                    secondary="Data modeling and validation for consistency"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Data Processing" 
                    secondary="Algorithms for environmental impact scoring and comparison"
                  />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <CloudIcon sx={{ mr: 1, color: 'primary.main' }} />
                Deployment & DevOps
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Vercel" 
                    secondary="Frontend hosting and continuous deployment"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Render" 
                    secondary="Backend hosting with automatic deployment from GitHub"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Git & GitHub" 
                    secondary="Version control and project management"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Environment Variables" 
                    secondary="Secure configuration for different deployment environments"
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Paper>
        
        {/* AI Implementation */}
        <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
            AI Implementation Details
          </Typography>
          <Typography variant="body1" paragraph>
            The core of this application is its AI-powered analysis system, which utilizes the OpenAI API to 
            process product information and generate environmental impact assessments. This implementation 
            demonstrates a practical application of AI for sustainability purposes.
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Text Analysis Process
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Natural Language Processing" 
                        secondary="Extracting key environmental indicators from product descriptions"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Entity Recognition" 
                        secondary="Identifying materials, manufacturing processes, and other relevant factors"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Contextual Analysis" 
                        secondary="Understanding the environmental implications of different product attributes"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Structured Output Generation" 
                        secondary="Creating consistent, categorized environmental assessments"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Scoring Algorithm
                  </Typography>
                  <Typography variant="body2" paragraph>
                    The AI generates environmental impact scores on a scale of 1-10 across multiple categories:
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <RecyclingIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Carbon Footprint (1-10)" 
                        secondary="Evaluates greenhouse gas emissions throughout the product lifecycle"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <WaterIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Water Usage (1-10)" 
                        secondary="Assesses water consumption and impact on water resources"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <SpaIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Resource Consumption (1-10)" 
                        secondary="Measures efficiency of resource use, recyclability, and waste generation"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <EcoIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Overall Score (1-10)" 
                        secondary="Weighted combination of individual scores with additional environmental factors"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
        
        {/* About the Developer */}
        <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
            About the Developer
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    width: 200, 
                    height: 200, 
                    borderRadius: '50%', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    margin: '0 auto',
                    overflow: 'hidden'
                  }}
                >
                  <img 
                    src="https://via.placeholder.com/200x200?text=Your+Photo" 
                    alt="Developer" 
                    style={{ width: '100%', height: 'auto' }} 
                  />
                </Paper>
                
                <Typography variant="h5" sx={{ mt: 2 }}>
                  Your Name
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Full Stack Developer
                </Typography>
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <MuiLink href="https://github.com/yourusername" target="_blank" rel="noopener">
                    <GitHubIcon fontSize="large" />
                  </MuiLink>
                  <MuiLink href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener">
                    <LinkedInIcon fontSize="large" />
                  </MuiLink>
                  <MuiLink href="mailto:your.email@example.com">
                    <EmailIcon fontSize="large" />
                  </MuiLink>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Project Background
              </Typography>
              <Typography variant="body1" paragraph>
                I created the Environmental Impact Analyzer as a demonstration of my skills in full-stack 
                development, AI integration, and sustainable technology solutions. As someone passionate about 
                both technology and environmental sustainability, this project represents the intersection of 
                these interests and showcases how technology can be leveraged to address important global challenges.
              </Typography>
              
              <Typography variant="h6" gutterBottom>
                Skills & Expertise
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Frontend Development (React.js)" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Backend Development (Node.js)" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Database Management (MongoDB)" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="RESTful API Design" />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="AI/ML Integration" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="UI/UX Design" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Cloud Deployment" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Version Control (Git)" />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Education & Background
              </Typography>
              <Typography variant="body1" paragraph>
                I am currently pursuing a degree in Computer Science with a focus on sustainable technology solutions.
                This project was developed as part of my portfolio for internship applications, demonstrating my 
                ability to apply theoretical knowledge to practical, real-world problems.
              </Typography>
              
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<GitHubIcon />}
                href="https://github.com/yourusername/environmental-impact-analyzer"
                target="_blank"
                rel="noopener"
                sx={{ mt: 2 }}
              >
                View Project on GitHub
              </Button>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Call to Action */}
        <Box
          sx={{
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
            Get Started Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default AboutPage;