import React from 'react';
import PropTypes from 'prop-types';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { Box, Paper, Typography, useTheme } from '@mui/material';

// Register ChartJS components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

/**
 * Component for visualizing environmental scores using a radar chart
 */
const ScoreChart = ({
  scores,
  title = 'Environmental Impact Scores',
  height = 300,
  width = '100%',
  withPaper = true,
  elevation = 1,
  showLegend = false,
  comparison = false,
  comparisonData = [],
  comparisonLabels = [],
  maxScore = 10
}) => {
  const theme = useTheme();
  
  // Format single score data
  const formatSingleScoreData = () => {
    return {
      labels: ['Carbon Footprint', 'Water Usage', 'Resource Consumption', 'Overall'],
      datasets: [
        {
          label: 'Environmental Scores',
          data: [
            scores.carbon || 0,
            scores.water || 0,
            scores.resources || 0,
            scores.overall || 0
          ],
          backgroundColor: `${theme.palette.primary.main}40`, // 40 is for 25% opacity
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
          pointBackgroundColor: theme.palette.primary.main,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: theme.palette.primary.main,
          pointRadius: 4
        }
      ]
    };
  };
  
  // Format comparison data for multiple products
  const formatComparisonData = () => {
    // Colors for different datasets
    const colors = [
      theme.palette.primary,
      theme.palette.secondary,
      theme.palette.error,
      theme.palette.success,
      theme.palette.warning,
    ];
    
    // Build datasets from comparison data
    const datasets = comparisonData.map((data, index) => {
      const color = colors[index % colors.length];
      
      return {
        label: comparisonLabels[index] || `Product ${index + 1}`,
        data: [
          data.carbon || 0,
          data.water || 0,
          data.resources || 0,
          data.overall || 0
        ],
        backgroundColor: `${color.main}30`, // 30 is for 19% opacity
        borderColor: color.main,
        borderWidth: 2,
        pointBackgroundColor: color.main,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: color.main,
        pointRadius: 4
      };
    });
    
    return {
      labels: ['Carbon Footprint', 'Water Usage', 'Resource Consumption', 'Overall'],
      datasets
    };
  };
  
  // Chart options
  const options = {
    scales: {
      r: {
        angleLines: {
          display: true,
          color: theme.palette.divider
        },
        grid: {
          color: theme.palette.divider
        },
        pointLabels: {
          font: {
            size: 12,
            family: theme.typography.fontFamily
          },
          color: theme.palette.text.primary
        },
        suggestedMin: 0,
        suggestedMax: maxScore,
        ticks: {
          stepSize: 2,
          backdropColor: 'transparent'
        }
      }
    },
    plugins: {
      legend: {
        display: showLegend || comparison,
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
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.r}/10`;
          }
        }
      }
    },
    maintainAspectRatio: false
  };
  
  // Choose data based on comparison mode
  const chartData = comparison ? formatComparisonData() : formatSingleScoreData();
  
  // Create chart content
  const chartContent = (
    <Box sx={{ height, width, p: 2 }}>
      {title && (
        <Typography variant="h6" align="center" gutterBottom>
          {title}
        </Typography>
      )}
      <Box sx={{ height: title ? 'calc(100% - 30px)' : '100%', width: '100%' }}>
        <Radar data={chartData} options={options} />
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

ScoreChart.propTypes = {
  /** Environmental scores object */
  scores: PropTypes.shape({
    carbon: PropTypes.number,
    water: PropTypes.number,
    resources: PropTypes.number,
    overall: PropTypes.number
  }),
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
  /** Whether to show the legend */
  showLegend: PropTypes.bool,
  /** Whether this is a comparison chart with multiple datasets */
  comparison: PropTypes.bool,
  /** Array of score objects for comparison mode */
  comparisonData: PropTypes.arrayOf(
    PropTypes.shape({
      carbon: PropTypes.number,
      water: PropTypes.number,
      resources: PropTypes.number,
      overall: PropTypes.number
    })
  ),
  /** Labels for comparison datasets */
  comparisonLabels: PropTypes.arrayOf(PropTypes.string),
  /** Maximum score value */
  maxScore: PropTypes.number
};

export default ScoreChart;