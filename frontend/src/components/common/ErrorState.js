import React from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Alert, 
  AlertTitle 
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';

/**
 * Component for displaying error states with optional retry functionality
 */
const ErrorState = ({
  error,
  message = 'An error occurred',
  severity = 'error',
  onRetry,
  fullPage = false,
  withPaper = true,
  padding = 4
}) => {
  // Set minimum height for the container
  const minHeight = fullPage ? 'calc(100vh - 200px)' : 'inherit';
  
  // Determine error message to display
  const errorMessage = error?.message || error || message;
  
  // Define the content
  const content = (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        p: padding,
        minHeight,
        width: '100%'
      }}
    >
      <Alert 
        severity={severity}
        variant="outlined"
        icon={<ErrorOutlineIcon fontSize="large" />}
        sx={{ 
          mb: 3, 
          width: '100%', 
          alignItems: 'center',
          '& .MuiAlert-icon': {
            fontSize: 28,
            padding: '10px 0'
          }
        }}
      >
        <AlertTitle sx={{ fontWeight: 'bold' }}>
          {severity === 'error' ? 'Error' : 
           severity === 'warning' ? 'Warning' : 
           severity === 'info' ? 'Information' : 'Success'}
        </AlertTitle>
        <Typography variant="body1">
          {errorMessage}
        </Typography>
      </Alert>
      
      {onRetry && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={onRetry}
        >
          Try Again
        </Button>
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
        alignItems: 'center',
        width: '100%'
      }}
    >
      {content}
    </Paper>
  ) : content;
};

ErrorState.propTypes = {
  /** Error object or error message string */
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  /** Fallback message if no error is provided */
  message: PropTypes.string,
  /** Alert severity */
  severity: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
  /** Callback function for retry button */
  onRetry: PropTypes.func,
  /** Whether to take up full page height */
  fullPage: PropTypes.bool,
  /** Whether to wrap in a Paper component */
  withPaper: PropTypes.bool,
  /** Padding around the error message */
  padding: PropTypes.number
};

export default ErrorState;