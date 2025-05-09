import React from 'react';
import { 
  Snackbar, 
  Alert, 
  IconButton, 
  Button, 
  Box 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppContext } from '../../context/AppContext';

/**
 * Notifications component that displays alerts and messages
 * Uses the global app context to manage notifications
 */
const Notifications = () => {
  // Get notifications from context
  const { notifications, removeNotification } = useAppContext();
  
  // Handle closing a notification
  const handleClose = (id) => () => {
    removeNotification(id);
  };
  
  // If no notifications, don't render anything
  if (!notifications.length) {
    return null;
  }
  
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        maxWidth: '100%',
        width: 'auto'
      }}
    >
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{ position: 'relative', mt: 1 }} // Override fixed positioning
        >
          <Alert
            severity={notification.type}
            variant="filled"
            sx={{ width: '100%', maxWidth: 400 }}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose(notification.id)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {notification.message}
            {notification.action && (
              <Box sx={{ mt: 1 }}>
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={() => {
                    notification.action.onClick();
                    removeNotification(notification.id);
                  }}
                >
                  {notification.action.label}
                </Button>
              </Box>
            )}
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
};

export default Notifications;