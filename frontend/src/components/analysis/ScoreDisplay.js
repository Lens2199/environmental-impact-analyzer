import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Tooltip, LinearProgress } from '@mui/material';
import { getScoreColorClass, getScoreLabel } from '../../utils/helpers';

/**
 * Component to display an environmental score with visual elements
 */
const ScoreDisplay = ({ 
  score, 
  label, 
  icon, 
  size = 'medium', 
  showLabel = true,
  showProgress = true,
  tooltipPlacement = 'top'
}) => {
  // Validate score is within range
  const validScore = Math.max(1, Math.min(10, score || 1));
  
  // Get color class based on score
  const scoreClass = getScoreColorClass(validScore);
  
  // Get score label (Excellent, Good, etc.)
  const scoreLabel = getScoreLabel(validScore);
  
  // Set dimensions based on size prop
  let dimensions = {};
  let fontSize = '';
  
  switch (size) {
    case 'large':
      dimensions = { width: 100, height: 100 };
      fontSize = '2rem';
      break;
    case 'small':
      dimensions = { width: 50, height: 50 };
      fontSize = '1.2rem';
      break;
    case 'medium':
    default:
      dimensions = { width: 80, height: 80 };
      fontSize = '1.5rem';
  }
  
  return (
    <Box sx={{ textAlign: 'center' }}>
      {/* Score Circle */}
      <Tooltip 
        title={`${scoreLabel} (${validScore}/10)`}
        placement={tooltipPlacement}
        arrow
      >
        <Box 
          className={`analysis-score-circle ${scoreClass}`}
          sx={{ 
            ...dimensions,
            fontSize,
            mb: 1,
            mx: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            borderRadius: '50%'
          }}
        >
          {validScore}
        </Box>
      </Tooltip>
      
      {/* Label */}
      {showLabel && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          mb: showProgress ? 1 : 0
        }}>
          {icon && React.cloneElement(icon, { 
            sx: { 
              mr: 0.5,
              color: 'primary.main',
              fontSize: size === 'small' ? '1rem' : '1.25rem'
            } 
          })}
          <Typography 
            variant={size === 'small' ? 'body2' : 'body1'} 
            component="div"
            fontWeight={500}
          >
            {label}
          </Typography>
        </Box>
      )}
      
      {/* Progress Bar */}
      {showProgress && (
        <LinearProgress 
          variant="determinate" 
          value={validScore * 10} 
          sx={{ 
            height: size === 'small' ? 4 : 8, 
            borderRadius: 5,
            bgcolor: 'rgba(0,0,0,0.1)',
            width: showLabel ? '100%' : dimensions.width,
            mx: 'auto',
            '& .MuiLinearProgress-bar': {
              bgcolor: scoreClass === 'score-excellent' ? '#43a047' :
                      scoreClass === 'score-good' ? '#7cb342' :
                      scoreClass === 'score-average' ? '#fdd835' :
                      scoreClass === 'score-poor' ? '#fb8c00' : '#e53935'
            }
          }} 
        />
      )}
    </Box>
  );
};

ScoreDisplay.propTypes = {
  /** Score value (1-10) */
  score: PropTypes.number.isRequired,
  /** Score label text */
  label: PropTypes.string.isRequired,
  /** Optional icon to display next to the label */
  icon: PropTypes.node,
  /** Size of the score display (small, medium, large) */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /** Whether to show the label text */
  showLabel: PropTypes.bool,
  /** Whether to show the progress bar */
  showProgress: PropTypes.bool,
  /** Tooltip placement */
  tooltipPlacement: PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
};

export default ScoreDisplay;