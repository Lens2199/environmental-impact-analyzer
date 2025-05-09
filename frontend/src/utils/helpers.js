/**
 * Utility functions for the frontend application
 */

/**
 * Format a date string to a readable format
 * @param {String} dateString - The date string to format
 * @param {Object} options - Formatting options for Intl.DateTimeFormat
 * @returns {String} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    const dateOptions = { ...defaultOptions, ...options };
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', dateOptions).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString || 'Unknown date';
    }
  };
  
  /**
   * Format a date string to a relative time format (e.g., "2 hours ago")
   * @param {String} dateString - The date string to format
   * @returns {String} Relative time string
   */
  export const formatRelativeTime = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffSec = Math.round(diffMs / 1000);
      const diffMin = Math.round(diffSec / 60);
      const diffHour = Math.round(diffMin / 60);
      const diffDay = Math.round(diffHour / 24);
      
      if (diffSec < 60) {
        return 'just now';
      } else if (diffMin < 60) {
        return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
      } else if (diffHour < 24) {
        return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
      } else if (diffDay < 7) {
        return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;
      } else {
        return formatDate(dateString, { year: 'numeric', month: 'short', day: 'numeric' });
      }
    } catch (error) {
      console.error('Error formatting relative time:', error);
      return dateString || 'Unknown date';
    }
  };
  
  /**
   * Truncate text to a specified length with ellipsis
   * @param {String} text - The text to truncate
   * @param {Number} maxLength - Maximum length before truncation
   * @returns {String} Truncated text
   */
  export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    
    if (text.length <= maxLength) return text;
    
    return text.substring(0, maxLength) + '...';
  };
  
  /**
   * Get color class based on environmental score
   * @param {Number} score - Environmental score (1-10)
   * @returns {String} CSS class name
   */
  export const getScoreColorClass = (score) => {
    if (score >= 9) return 'score-excellent';
    if (score >= 7) return 'score-good';
    if (score >= 5) return 'score-average';
    if (score >= 3) return 'score-poor';
    return 'score-bad';
  };
  
  /**
   * Get color from theme palette based on environmental score
   * @param {Number} score - Environmental score (1-10)
   * @returns {String} Material UI color name
   */
  export const getScoreColor = (score) => {
    if (score >= 9) return 'success.main'; // Green
    if (score >= 7) return 'success.light'; // Light green
    if (score >= 5) return 'warning.main'; // Yellow
    if (score >= 3) return 'warning.dark'; // Orange
    return 'error.main'; // Red
  };
  
  /**
   * Get a descriptive label based on environmental score
   * @param {Number} score - Environmental score (1-10)
   * @returns {String} Descriptive label
   */
  export const getScoreLabel = (score) => {
    if (score >= 9) return 'Excellent';
    if (score >= 7) return 'Good';
    if (score >= 5) return 'Average';
    if (score >= 3) return 'Poor';
    return 'Bad';
  };
  
  /**
   * Format environmental score with label
   * @param {Number} score - Environmental score (1-10)
   * @returns {String} Formatted score with label
   */
  export const formatScore = (score) => {
    return `${score}/10 - ${getScoreLabel(score)}`;
  };
  
  /**
   * Create URL with query parameters
   * @param {String} baseUrl - Base URL
   * @param {Object} params - Query parameters
   * @returns {String} URL with query parameters
   */
  export const createUrlWithParams = (baseUrl, params = {}) => {
    const url = new URL(baseUrl, window.location.origin);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value);
      }
    });
    
    return url.toString();
  };
  
  /**
   * Copy text to clipboard
   * @param {String} text - Text to copy
   * @returns {Promise} Promise that resolves when text is copied
   */
  export const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  };
  
  /**
   * Debounce a function call
   * @param {Function} func - The function to debounce
   * @param {Number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  export const debounce = (func, wait = 300) => {
    let timeout;
    
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };