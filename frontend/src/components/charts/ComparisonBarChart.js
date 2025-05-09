import React from 'react';
import PropTypes from 'prop-types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { getScoreColor } from '../../utils/helpers';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Component for comparing environmental scores using a bar chart
 */
const ComparisonBarChart = ({
  products = [],
  title = 'Environmental Impact Comparison',
  height = 400,
  width = '100%',
  withPaper = true,
  elevation = 1,
  horizontal = false,
  scoreType = 'overall',
  showAllScores = false
}) => {
  const theme = useTheme();
  
  // Verify we have valid data
  if (!products || products.length === 0) {
    return null;
  }
  
  // Extract product names and scores
  const productNames = products.map(p => p.name || 'Unknown Product');
  
  // Format data for a single score type
  const formatSingleScoreData = () => {
    const data = {
      labels: productNames,
      datasets: [
        {
          label: `${scoreType.charAt(0).toUpperCase() + scoreType.slice(1)} Score`,
          data: products.map(p => {
            const score = p.scores ? p.scores[scoreType] || 0 : 0;
            return score;
          }),
          backgroundColor: products.map(p => {
            const score = p.scores ? p.scores[scoreType] || 0 : 0;
            return theme.palette[getScoreColor(score).split('.')[0]][getScoreColor(score).split('.')[1]];
          }),
          borderWidth: 1,
          borderColor: theme.palette.divider
        }
      ]
    };
    
    return data;
  };
  
  // Format data to show all score types
  const formatAllScoresData = () => {
    const carbonDataset = {
      label: 'Carbon Footprint',
      data: products.map(p => p.scores?.carbon || 0),
      backgroundColor: theme.palette.success.main,
      borderWidth: 1,
      borderColor: theme.palette.divider
    };
    
    const waterDataset = {
      label: 'Water Usage',
      data: products.map(p => p.scores?.water || 0),
      backgroundColor: theme.palette.info.main,
      borderWidth: 1,
      borderColor: theme.palette.divider
    };
    
    const resourcesDataset = {
      label: 'Resource Consumption',
      data: products.map(p => p.scores?.resources || 0),
      backgroundColor: theme.palette.warning.main,
      borderWidth: 1,
      borderColor: theme.palette.divider
    };
    
    const overallDataset = {
      label: 'Overall Score',
      data: products.map(p => p.scores?.overall || 0),
      backgroundColor: theme.palette.primary.main,
      borderWidth: 1,
      borderColor: theme.palette.divider
    };
    
    const data = {
      labels: productNames,
      datasets: [carbonDataset, waterDataset, resourcesDataset, overallDataset]
    };
    
    return data;
  };
  
  // Choose data format based on showAllScores
  const chartData = showAllScores ? formatAllScoresData() : formatSingleScoreData();
  
  // Chart options
  const options = {
    indexAxis: horizontal ? 'y' : 'x',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 1
        },
        title: {
          display: !horizontal,
          text: 'Score (1-10)',
          font: {
            size: 12,
            family: theme.typography.fontFamily
          }
        }
      },
      x: {
        title: {
          display: horizontal,
          text: 'Score (1-10)',
          font: {
            size: 12,
            family: theme.typography.fontFamily
          }
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: theme.typography.fontFamily
          },
          boxWidth: 16,
          padding: 16
        }
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 16,
        boxPadding: 6,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed[horizontal ? 'x' : 'y']}/10`;
          }
        }
      }
    }
  };
  
  // Create chart content
  const chartContent = (
    <Box sx={{ height, width, p: 2 }}>
      {title && (
        <Typography variant="h6" align="center" gutterBottom>
          {title}
        </Typography>
      )}
      <Box sx={{ height: title ? 'calc(100% - 30px)' : '100%', width: '100%' }}>
        <Bar data={chartData} options={options} />
      </Box>
    </Box>
  );
  
  // Return with or without Paper wrapper
  return withPaper ? (
    <Paper elevation={elevation}>
      {chartContent}
    </Paper>
  ) : chartContent;
};

ComparisonBarChart.propTypes = {
  /** Array of product objects with scores */
  products: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      scores: PropTypes.shape({
        carbon: PropTypes.number,
        water: PropTypes.number,
        resources: PropTypes.number,
        overall: PropTypes.number
      })
    })
  ).isRequired,
  /** Chart title */
  title: PropTypes.string,
  /** Chart height */
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** Chart width */
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** Whether to wrap in a Paper component */
  withPaper: PropTypes.bool,
  /** Paper elevation */
  elevation: PropTypes.number,
  /** Whether to display the chart horizontally */
  horizontal: PropTypes.bool,
  /** Which score type to display */
  scoreType: PropTypes.oneOf(['carbon', 'water', 'resources', 'overall']),
  /** Whether to show all score types */
  showAllScores: PropTypes.bool
};

export default ComparisonBarChart;