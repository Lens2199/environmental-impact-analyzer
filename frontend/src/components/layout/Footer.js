import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EcoIcon from '@mui/icons-material/Eco';
import GitHubIcon from '@mui/icons-material/GitHub';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.primary.main,
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Box display="flex" alignItems="center" mb={1}>
              <EcoIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Environmental Impact Analyzer
              </Typography>
            </Box>
            <Typography variant="body2">
              Making sustainable product decisions easier through AI-powered analysis.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link component={RouterLink} to="/" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Home
            </Link>
            <Link component={RouterLink} to="/search" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Search Products
            </Link>
            <Link component={RouterLink} to="/analyze" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Analyze a Product
            </Link>
            <Link component={RouterLink} to="/about" color="inherit" sx={{ display: 'block' }}>
              About
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Resources
            </Typography>
            <Link href="https://github.com/YOUR-USERNAME/environmental-impact-analyzer" target="_blank" rel="noopener" color="inherit" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <GitHubIcon sx={{ mr: 1, fontSize: 18 }} />
              GitHub Repository
            </Link>
            <Link href="https://openai.com" target="_blank" rel="noopener" color="inherit" sx={{ display: 'block', mb: 1 }}>
              OpenAI
            </Link>
            <Link href="https://www.epa.gov" target="_blank" rel="noopener" color="inherit" sx={{ display: 'block' }}>
              Environmental Protection Agency
            </Link>
          </Grid>
        </Grid>
        
        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="white">
            {'Copyright © '}
            <Link component={RouterLink} to="/" color="inherit">
              Environmental Impact Analyzer
            </Link>{' '}
            {new Date().getFullYear()}
            {'. '}
            Created for demonstration purposes.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;