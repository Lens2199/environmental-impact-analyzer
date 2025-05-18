import React from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Chip,
  Tooltip,
  IconButton
} from '@mui/material';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import EcoIcon from '../icons/EcoIcon';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { copyToClipboard } from '../../utils/helpers';

/**
 * Component for displaying environmental improvement suggestions
 */
const SuggestionsList = ({
  suggestions,
  title = 'Environmental Improvement Suggestions',
  icon = <TipsAndUpdatesIcon />,
  elevation = 1
}) => {
  // Process suggestions text into an array of individual suggestions
  const processSuggestions = (suggestionsText) => {
    if (!suggestionsText) return [];
    
    // Try to split by numbered list format (e.g., "1. Suggestion one")
    const numberedSuggestions = suggestionsText.split(/\d+\.\s+/).filter(s => s.trim());
    if (numberedSuggestions.length > 1) {
      return numberedSuggestions;
    }
    
    // Try to split by bullet points
    const bulletSuggestions = suggestionsText.split(/•|\*|\-\s+/).filter(s => s.trim());
    if (bulletSuggestions.length > 1) {
      return bulletSuggestions;
    }
    
    // Try to split by sentences
    return suggestionsText.split(/\.\s+/).filter(s => s.trim()).map(s => s + '.');
  };
  
  // Handle copying suggestion to clipboard
  const handleCopy = (text) => {
    copyToClipboard(text)
      .then(() => {
        // Could show a success message here
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };
  
  // Process suggestions into an array
  const suggestionItems = processSuggestions(suggestions);
  
  // If no suggestions are available
  if (!suggestions || suggestionItems.length === 0) {
    return (
      <Paper elevation={elevation} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {React.cloneElement(icon, { color: 'primary', sx: { mr: 1 } })}
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          No specific suggestions are available for this product. 
          Try analyzing the product with more detailed information.
        </Typography>
      </Paper>
    );
  }
  
  return (
    <Paper elevation={elevation} sx={{ borderRadius: 2 }}>
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {React.cloneElement(icon, { sx: { mr: 1 } })}
          <Typography variant="h6">{title}</Typography>
        </Box>
      </Box>
      
      <List sx={{ py: 0 }}>
        {suggestionItems.map((suggestion, index) => (
          <React.Fragment key={index}>
            {index > 0 && <Divider component="li" />}
            <ListItem
              alignItems="flex-start"
              secondaryAction={
                <Tooltip title="Copy suggestion">
                  <IconButton 
                    edge="end" 
                    aria-label="copy" 
                    onClick={() => handleCopy(suggestion)}
                    size="small"
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              }
            >
              <ListItemIcon>
                <EcoIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" component="div">
                    {suggestion}
                  </Typography>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    {getRelevantTags(suggestion).map((tag, i) => (
                      <Chip
                        key={i}
                        label={tag}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                }
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

/**
 * Helper function to extract relevant tags from a suggestion
 * @param {string} suggestion - The suggestion text
 * @returns {string[]} Array of relevant tags
 */
const getRelevantTags = (suggestion) => {
  const tags = [];
  const lowerSuggestion = suggestion.toLowerCase();
  
  // Environmental impact categories
  if (lowerSuggestion.includes('carbon') || lowerSuggestion.includes('emission') || lowerSuggestion.includes('greenhouse')) {
    tags.push('Carbon Footprint');
  }
  
  if (lowerSuggestion.includes('water') || lowerSuggestion.includes('irrigation') || lowerSuggestion.includes('liquid')) {
    tags.push('Water Usage');
  }
  
  if (lowerSuggestion.includes('resource') || lowerSuggestion.includes('material') || lowerSuggestion.includes('consumption')) {
    tags.push('Resource Consumption');
  }
  
  // Common sustainability themes
  if (lowerSuggestion.includes('recycl') || lowerSuggestion.includes('reuse')) {
    tags.push('Recycling');
  }
  
  if (lowerSuggestion.includes('energy') || lowerSuggestion.includes('power') || lowerSuggestion.includes('electricity')) {
    tags.push('Energy Efficiency');
  }
  
  if (lowerSuggestion.includes('packag')) {
    tags.push('Packaging');
  }
  
  if (lowerSuggestion.includes('transport') || lowerSuggestion.includes('ship') || lowerSuggestion.includes('logistics')) {
    tags.push('Transportation');
  }
  
  if (lowerSuggestion.includes('biodegradable') || lowerSuggestion.includes('compost')) {
    tags.push('Biodegradability');
  }
  
  if (lowerSuggestion.includes('chemical') || lowerSuggestion.includes('toxic') || lowerSuggestion.includes('pollut')) {
    tags.push('Chemical Reduction');
  }
  
  // If no tags were found, add a generic one
  if (tags.length === 0) {
    tags.push('Sustainability');
  }
  
  return tags;
};

SuggestionsList.propTypes = {
  /** Suggestions text (can be a string with multiple suggestions) */
  suggestions: PropTypes.string.isRequired,
  /** Title for the suggestions panel */
  title: PropTypes.string,
  /** Icon to display next to the title */
  icon: PropTypes.node,
  /** Paper elevation */
  elevation: PropTypes.number
};

export default SuggestionsList;