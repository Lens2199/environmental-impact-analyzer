import React from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Divider, 
  Chip,
  Card,
  CardContent
} from '@mui/material';
import RecyclingIcon from '@mui/icons-material/Recycling';
import WaterIcon from '@mui/icons-material/Water';
import SpaIcon from '@mui/icons-material/Spa';
import EcoIcon from '@mui/icons-material/Eco';
import ScoreDisplay from './ScoreDisplay';
import { truncateText, formatDate } from '../../utils/helpers';

/**
 * Component to display a summary of environmental impact analysis
 */
const ImpactSummary = ({ 
  analysis, 
  compact = false, 
  elevation = 1,
  showExplanation = true,
  showDate = true
}) => {
  if (!analysis || !analysis.scores) {
    return null;
  }
  
  const { scores, explanation, createdAt } = analysis;
  
  return (
    <Paper 
      elevation={elevation} 
      sx={{ 
        p: compact ? 2 : 3, 
        borderRadius: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Overall Score */}
      <Box sx={{ textAlign: 'center', mb: compact ? 2 : 3 }}>
        <Typography variant={compact ? 'h6' : 'h5'} gutterBottom>
          Overall Environmental Impact
        </Typography>
        <ScoreDisplay 
          score={scores.overall} 
          label="Overall Score"
          icon={<EcoIcon />}
          size={compact ? 'medium' : 'large'}
        />
      </Box>
      
      {/* Explanation (Optional) */}
      {showExplanation && explanation && (
        <>
          <Divider sx={{ my: compact ? 1 : 2 }} />
          <Typography variant="body1" sx={{ mb: 2, px: compact ? 0 : 1 }}>
            {compact ? truncateText(explanation, 150) : explanation}
          </Typography>
        </>
      )}
      
      {/* Detailed Scores */}
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={compact ? 1 : 3} sx={{ mt: compact ? 0 : 1 }}>
          <Grid item xs={4}>
            <ScoreDisplay 
              score={scores.carbon} 
              label="Carbon"
              icon={<RecyclingIcon />}
              size={compact ? 'small' : 'medium'}
              showProgress={!compact}
            />
          </Grid>
          <Grid item xs={4}>
            <ScoreDisplay 
              score={scores.water} 
              label="Water"
              icon={<WaterIcon />}
              size={compact ? 'small' : 'medium'}
              showProgress={!compact}
            />
          </Grid>
          <Grid item xs={4}>
            <ScoreDisplay 
              score={scores.resources} 
              label="Resources"
              icon={<SpaIcon />}
              size={compact ? 'small' : 'medium'}
              showProgress={!compact}
            />
          </Grid>
        </Grid>
      </Box>
      
      {/* Analysis Date (Optional) */}
      {showDate && createdAt && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Typography variant="caption" color="text.secondary">
            Analysis date: {formatDate(createdAt)}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

/**
 * Component for displaying multiple impact summaries in a comparison view
 */
export const ImpactComparisonGrid = ({ analyses, elevation = 1 }) => {
  if (!analyses || analyses.length === 0) {
    return null;
  }
  
  return (
    <Grid container spacing={3}>
      {analyses.map((analysis, index) => (
        <Grid item xs={12} sm={6} md={analyses.length > 2 ? 4 : 6} key={index}>
          <Card elevation={elevation} sx={{ height: '100%' }}>
            {analysis.product && (
              <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h6">{analysis.product.name}</Typography>
                <Chip 
                  label={analysis.product.category} 
                  size="small" 
                  sx={{ 
                    mt: 1, 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white' 
                  }} 
                />
              </Box>
            )}
            <CardContent>
              <ImpactSummary 
                analysis={analysis} 
                compact={true} 
                elevation={0}
                showDate={true}
              />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

ImpactSummary.propTypes = {
  /** Analysis data with scores and explanation */
  analysis: PropTypes.shape({
    scores: PropTypes.shape({
      carbon: PropTypes.number.isRequired,
      water: PropTypes.number.isRequired,
      resources: PropTypes.number.isRequired,
      overall: PropTypes.number.isRequired
    }).isRequired,
    explanation: PropTypes.string,
    createdAt: PropTypes.string
  }).isRequired,
  /** Whether to display in compact mode */
  compact: PropTypes.bool,
  /** Paper elevation */
  elevation: PropTypes.number,
  /** Whether to show the explanation text */
  showExplanation: PropTypes.bool,
  /** Whether to show the analysis date */
  showDate: PropTypes.bool
};

ImpactComparisonGrid.propTypes = {
  /** Array of analyses to compare */
  analyses: PropTypes.array.isRequired,
  /** Card elevation */
  elevation: PropTypes.number
};

export default ImpactSummary;