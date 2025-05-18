import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { analysisAPI } from '../services/api';

// Create context
const AppContext = createContext();

/**
 * AppContext Provider Component
 * Manages global application state
 */
export const AppProvider = ({ children }) => {
  // Recent analyses state
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [loadingAnalyses, setLoadingAnalyses] = useState(false);
  const [analysesError, setAnalysesError] = useState(null);
  
  // Selected products for comparison - initialize as empty array
  const [selectedProducts, setSelectedProducts] = useState([]);
  
  // NEW: Store full product objects, not just IDs
  const [selectedProductObjects, setSelectedProductObjects] = useState([]);
  
  // User preferences (could be expanded or stored in localStorage)
  const [preferences, setPreferences] = useState({
    darkMode: false,
    showScores: true,
    defaultView: 'grid',
  });
  
  // Notifications
  const [notifications, setNotifications] = useState([]);
  
  // Fetch recent analyses on component mount
  useEffect(() => {
    fetchRecentAnalyses();
    console.log('AppContext initialized');
  }, []);
  
  // Function to fetch recent analyses
  const fetchRecentAnalyses = async () => {
    try {
      setLoadingAnalyses(true);
      setAnalysesError(null);
      
      const response = await analysisAPI.getAnalysisHistory();
      setRecentAnalyses(response.data.analyses || response.data || []);
      
    } catch (error) {
      console.error('Error fetching analyses:', error);
      setAnalysesError('Failed to load recent analyses');
    } finally {
      setLoadingAnalyses(false);
    }
  };
  
  // Helper to get product ID consistently
  const getProductId = (product) => {
    if (!product) return null;
    return product._id || product.id || null;
  };
  
  // Add or remove product from selected products for comparison - ENHANCED TO STORE FULL OBJECTS
  const toggleProductSelection = (productId, productObject = null) => {
    console.log('toggleProductSelection called with:', productId);
    
    // Guard against undefined values
    if (!productId) {
      console.error('Attempted to toggle selection with invalid productId:', productId);
      return;
    }
    
    setSelectedProducts(prevSelected => {
      console.log('Previous selected products:', prevSelected);
      
      // Make a defensive copy of prevSelected to ensure it's an array
      const safeSelected = Array.isArray(prevSelected) ? [...prevSelected] : [];
      
      // Check if already selected
      if (safeSelected.includes(productId)) {
        console.log('Removing product from selection');
        
        // Also remove from product objects
        setSelectedProductObjects(prev => 
          prev.filter(product => getProductId(product) !== productId)
        );
        
        const newSelection = safeSelected.filter(id => id !== productId);
        console.log('New selection will be:', newSelection);
        return newSelection;
      } else {
        // Add if fewer than 3 already selected
        if (safeSelected.length < 3) {
          console.log('Adding product to selection');
          
          // Add to product objects if provided
          if (productObject) {
            setSelectedProductObjects(prev => [...prev, productObject]);
          }
          
          const newSelection = [...safeSelected, productId];
          console.log('New selection will be:', newSelection);
          return newSelection;
        } else {
          console.log('Selection limit reached, not adding');
          // Add notification about max products
          addNotification({
            type: 'warning',
            message: 'You can only compare up to 3 products at a time',
            duration: 3000
          });
          return safeSelected;
        }
      }
    });
  };
  
  // Clear all selected products
  const clearSelectedProducts = () => {
    console.log('Clearing all selected products');
    setSelectedProducts([]);
    setSelectedProductObjects([]);  // Clear product objects too
  };
  
  // Update user preferences
  const updatePreferences = (newPreferences) => {
    setPreferences({ ...preferences, ...newPreferences });
    
    // In a real app, you might save preferences to localStorage
    localStorage.setItem('userPreferences', JSON.stringify({
      ...preferences,
      ...newPreferences
    }));
  };
  
  // Add notification
  const addNotification = (notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      type: notification.type || 'info',
      message: notification.message,
      duration: notification.duration || 5000
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove notification after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  };
  
  // Remove notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // Load stored preferences from localStorage
  useEffect(() => {
    try {
      const storedPreferences = localStorage.getItem('userPreferences');
      if (storedPreferences) {
        setPreferences(JSON.parse(storedPreferences));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  }, []);
  
  // Debug effect to log selected products changes
  useEffect(() => {
    console.log('selectedProducts state changed to:', selectedProducts);
  }, [selectedProducts]);
  
  // Debug effect to log selected product objects
  useEffect(() => {
    console.log('selectedProductObjects state changed to:', selectedProductObjects);
  }, [selectedProductObjects]);
  
  // Value to be provided by the context
  const contextValue = {
    // Analyses
    recentAnalyses,
    loadingAnalyses,
    analysesError,
    fetchRecentAnalyses,
    
    // Products for comparison
    selectedProducts,
    selectedProductObjects,  // NEW: Export full objects
    toggleProductSelection,
    clearSelectedProducts,
    getProductId,            // NEW: Helper function
    
    // User preferences
    preferences,
    updatePreferences,
    
    // Notifications
    notifications,
    addNotification,
    removeNotification
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired
};

/**
 * Custom hook to use the app context
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;