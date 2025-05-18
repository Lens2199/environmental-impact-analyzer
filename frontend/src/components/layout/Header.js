import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';

import { 
  Menu as MenuIcon,
  Search as SearchIcon,
  CompareArrows as CompareArrowsIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';

import EcoIcon from '../icons/EcoIcon';

function Header() {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { label: 'Home', path: '/', icon: <EcoIcon sx={{ mr: 1 }} /> },
    { label: 'Search Products', path: '/search', icon: <SearchIcon sx={{ mr: 1 }} /> },
    { label: 'Analyze', path: '/analyze', icon: <AnalyticsIcon sx={{ mr: 1 }} /> },
    { label: 'Compare', path: '/compare', icon: <CompareArrowsIcon sx={{ mr: 1 }} /> }
    // Removed About link
  ];
  
  return (
    <AppBar position="static" className="eco-gradient-bg">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <EcoIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            ECO ANALYZER
          </Typography>
          
          {isMobile ? (
            <>
              <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                  {navItems.map((item) => (
                    <MenuItem 
                      key={item.path} 
                      onClick={handleMenuClose}
                      component={RouterLink}
                      to={item.path}
                      selected={isActive(item.path)}
                    >
                      {item.icon}
                      <Typography textAlign="center">{item.label}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              <EcoIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component={RouterLink}
                to="/"
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontWeight: 700,
                  letterSpacing: '.1rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                ECO ANALYZER
              </Typography>
            </>
          ) : (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  sx={{ 
                    my: 2, 
                    color: 'white', 
                    display: 'flex',
                    borderBottom: isActive(item.path) ? '3px solid white' : 'none',
                    borderRadius: 0,
                    mx: 1
                  }}
                  startIcon={item.icon}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;