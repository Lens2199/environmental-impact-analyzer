import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';

/**
 * Reusable confirmation dialog component
 */
const ConfirmationDialog = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  confirmColor = 'primary',
  type = 'info',
  fullWidth = true,
  maxWidth = 'sm',
  showIcon = true
}) => {
  // Define icon based on dialog type
  let icon;
  switch (type) {
    case 'success':
      icon = <CheckCircleIcon color="success" sx={{ fontSize: 32 }} />;
      break;
    case 'error':
      icon = <ErrorOutlineIcon color="error" sx={{ fontSize: 32 }} />;
      break;
    case 'warning':
      icon = <WarningAmberIcon color="warning" sx={{ fontSize: 32 }} />;
      break;
    case 'info':
    default:
      icon = <InfoIcon color="info" sx={{ fontSize: 32 }} />;
  }
  
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      <DialogTitle id="confirmation-dialog-title" sx={{ pr: 8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {showIcon && (
            <Box sx={{ mr: 2 }}>
              {icon}
            </Box>
          )}
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onCancel}
          sx={{
            position: 'absolute',
            right: 16,
            top: 12,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onCancel} 
          color="inherit" 
          variant="outlined"
          sx={{ mr: 1 }}
        >
          {cancelLabel}
        </Button>
        <Button 
          onClick={onConfirm} 
          color={confirmColor}
          variant="contained"
          autoFocus
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmationDialog.propTypes = {
  /** Whether the dialog is open */
  open: PropTypes.bool.isRequired,
  /** Dialog title */
  title: PropTypes.string.isRequired,
  /** Dialog message */
  message: PropTypes.node.isRequired,
  /** Label for the confirm button */
  confirmLabel: PropTypes.string,
  /** Label for the cancel button */
  cancelLabel: PropTypes.string,
  /** Function called when confirm button is clicked */
  onConfirm: PropTypes.func.isRequired,
  /** Function called when cancel button is clicked or dialog is closed */
  onCancel: PropTypes.func.isRequired,
  /** Color of the confirm button */
  confirmColor: PropTypes.oneOf(['primary', 'secondary', 'error', 'info', 'success', 'warning']),
  /** Type of dialog, affects the icon shown */
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  /** Whether the dialog should take up the full width */
  fullWidth: PropTypes.bool,
  /** Maximum width of the dialog */
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Whether to show the icon */
  showIcon: PropTypes.bool
};

export default ConfirmationDialog;