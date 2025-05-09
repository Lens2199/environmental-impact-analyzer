import React from 'react';
import PropTypes from 'prop-types';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';

/**
 * Component for displaying a loading state with customizable message
 */
const LoadingState = ({ 
  message = 'Loading...',
  size = 'medium', 
  fullPage = false,
  padding = 4,
  withPaper = true
}) => {
  // Determine size of circular progress
  const progressSize = size === 'small' ? 30 : size === 'large' ? 60 : 40;
  
  // Set minimum height for the container
  const minHeight = fullPage ? 'calc(100vh - 200px)' : 'inherit';
  
  // Define the content
  const content = (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        p: padding,
        minHeight
      }}
    >
      <CircularProgress size={progressSize} />
      {message && (
        <Typography 
          variant={size === 'small' ? 'body2' : 'body1'} 
          sx={{ mt: 2 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
  
  // Return with or without Paper wrapper
  return withPaper ? (
    <Paper 
      elevation={1} 
      sx={{ 
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center' 
      }}
    >
      {content}
    </Paper>
  ) : content;
};

LoadingState.propTypes = {
  /** Loading message text */
  message: PropTypes.string,
  /** Size of the loading indicator */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /** Whether to take up full page height */
  fullPage: PropTypes.bool,
  /** Padding around the loading indicator */
  padding: PropTypes.number,
  /** Whether to wrap in a Paper component */
  withPaper: PropTypes.bool
};

export default LoadingState;