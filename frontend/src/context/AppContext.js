import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { productAPI, analysisAPI } from '../services/api';

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
  
  // Selected products for comparison
  const [selectedProducts, setSelectedProducts] = useState([]);
  
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
  
  // Add or remove product from selected products for comparison
  const toggleProductSelection = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      // Limit to 3 products maximum
      if (selectedProducts.length < 3) {
        setSelectedProducts([...selectedProducts, productId]);
      } else {
        // Add notification if more than 3 products are selected
        addNotification({
          type: 'warning',
          message: 'You can only compare up to 3 products at a time',
          duration: 3000
        });
      }
    }
  };
  
  // Clear all selected products
  const clearSelectedProducts = () => {
    setSelectedProducts([]);
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
  
  // Value to be provided by the context
  const contextValue = {
    // Analyses
    recentAnalyses,
    loadingAnalyses,
    analysesError,
    fetchRecentAnalyses,
    
    // Products for comparison
    selectedProducts,
    toggleProductSelection,
    clearSelectedProducts,
    
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