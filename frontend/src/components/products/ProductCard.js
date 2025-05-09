import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Checkbox
} from '@mui/material';
import EcoIcon from '@mui/icons-material/Eco';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import PlaceIcon from '@mui/icons-material/Place';
import ScoreDisplay from '../analysis/ScoreDisplay';
import { truncateText } from '../../utils/helpers';

/**
 * Component for displaying a product card with environmental information
 */
const ProductCard = ({ 
  product, 
  analysis = null, 
  selectable = false,
  selected = false,
  onSelect,
  showScore = true,
  elevation = 2,
  compact = false
}) => {
  const navigate = useNavigate();
  
  if (!product) return null;
  
  // Handle card click
  const handleCardClick = () => {
    navigate(`/products/${product._id}`);
  };
  
  // Handle analyze button click
  const handleAnalyze = (e) => {
    e.stopPropagation();
    navigate(`/analyze?productId=${product._id}`);
  };
  
  // Handle compare button click
  const handleCompare = (e) => {
    e.stopPropagation();
    navigate(`/compare?products=${product._id}`);
  };
  
  // Handle select/deselect for comparison
  const handleSelect = (e) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(product._id);
    }
  };
  
  // Determine if we have an environmental score to display
  const hasScore = analysis && analysis.scores && analysis.scores.overall;
  
  return (
    <Card 
      elevation={elevation} 
      className="product-card"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        border: selected ? '2px solid' : 'none',
        borderColor: selected ? 'primary.main' : 'transparent',
        position: 'relative'
      }}
      onClick={handleCardClick}
    >
      {/* Selection Checkbox (Optional) */}
      {selectable && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 8, 
            right: 8, 
            zIndex: 1,
            bgcolor: 'rgba(255,255,255,0.7)',
            borderRadius: '50%'
          }}
          onClick={handleSelect}
        >
          <Checkbox
            checked={selected}
            icon={<CheckBoxOutlineBlankIcon />}
            checkedIcon={<CheckBoxIcon />}
            onClick={e => e.stopPropagation()}
            onChange={handleSelect}
            color="primary"
          />
        </Box>
      )}
      
      {/* Product Image */}
      <CardMedia
        component="img"
        height={compact ? 120 : 140}
        image={product.imageUrl || `https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}`}
        alt={product.name}
      />
      
      {/* Environmental Score Badge (if available) */}
      {showScore && hasScore && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 8, 
            left: 8,
            bgcolor: 'rgba(255,255,255,0.85)',
            borderRadius: '50%',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 1,
            border: '2px solid',
            borderColor: theme => {
              const score = analysis.scores.overall;
              if (score >= 9) return theme.palette.success.main;
              if (score >= 7) return theme.palette.success.light;
              if (score >= 5) return theme.palette.warning.main;
              if (score >= 3) return theme.palette.warning.dark;
              return theme.palette.error.main;
            }
          }}
        >
          <Tooltip title={`Environmental Score: ${analysis.scores.overall}/10`} arrow>
            <Typography 
              variant="h6" 
              component="div"
              fontWeight="bold"
              sx={{ 
                color: theme => {
                  const score = analysis.scores.overall;
                  if (score >= 9) return theme.palette.success.main;
                  if (score >= 7) return theme.palette.success.light;
                  if (score >= 5) return theme.palette.warning.main;
                  if (score >= 3) return theme.palette.warning.dark;
                  return theme.palette.error.main;
                }
              }}
            >
              {analysis.scores.overall}
            </Typography>
          </Tooltip>
        </Box>
      )}
      
      {/* Product Content */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant={compact ? "body1" : "h6"} component="div" fontWeight={500}>
          {product.name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 0.5 }}>
          <Chip
            label={product.category}
            size="small"
            color="primary"
            variant="outlined"
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
            <PlaceIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
            <Typography variant="caption" color="text.secondary">
              {product.manufacturingLocation}
            </Typography>
          </Box>
        </Box>
        
        {!compact && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {truncateText(product.description, 100)}
          </Typography>
        )}
        
        {!compact && product.materials && product.materials.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            <strong>Materials:</strong> {product.materials.join(', ')}
          </Typography>
        )}
        
        {/* Environmental Score (if available and showing in non-compact mode) */}
        {showScore && hasScore && !compact && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight={500} gutterBottom>
              Environmental Impact:
            </Typography>
            <ScoreDisplay 
              score={analysis.scores.overall}
              label="Overall"
              icon={<EcoIcon />}
              size="small"
              showLabel={false}
            />
          </Box>
        )}
      </CardContent>
      
      {/* Actions */}
      <CardActions sx={{ justifyContent: 'space-between', p: 1 }}>
        <Button 
          size="small" 
          startIcon={<EcoIcon />}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/products/${product._id}`);
          }}
        >
          Details
        </Button>
        
        <Box>
          <Tooltip title="Analyze Environmental Impact">
            <IconButton 
              size="small" 
              color="primary"
              onClick={handleAnalyze}
            >
              <AnalyticsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Compare with other products">
            <IconButton 
              size="small" 
              color={selected ? "primary" : "default"}
              onClick={handleCompare}
            >
              <CompareArrowsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
};

ProductCard.propTypes = {
  /** Product data object */
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string,
    materials: PropTypes.array,
    manufacturingLocation: PropTypes.string,
    imageUrl: PropTypes.string
  }).isRequired,
  /** Analysis data (if available) */
  analysis: PropTypes.object,
  /** Whether the card is selectable for comparison */
  selectable: PropTypes.bool,
  /** Whether the card is currently selected */
  selected: PropTypes.bool,
  /** Callback for selection changes */
  onSelect: PropTypes.func,
  /** Whether to show the environmental score */
  showScore: PropTypes.bool,
  /** Card elevation */
  elevation: PropTypes.number,
  /** Whether to display in compact mode */
  compact: PropTypes.bool
};

export default ProductCard;