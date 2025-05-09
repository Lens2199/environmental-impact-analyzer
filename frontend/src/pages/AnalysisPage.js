import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Chip,
  Tabs,
  Tab,
  LinearProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import EcoIcon from '@mui/icons-material/Eco';
import WaterIcon from '@mui/icons-material/Water';
import SpaIcon from '@mui/icons-material/Spa';
import RecyclingIcon from '@mui/icons-material/Recycling';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import axios from 'axios';

// Component for displaying individual score
const ScoreCircle = ({ score, label, icon }) => {
  let scoreClass = '';
  
  if (score >= 9) scoreClass = 'score-excellent';
  else if (score >= 7) scoreClass = 'score-good';
  else if (score >= 5) scoreClass = 'score-average';
  else if (score >= 3) scoreClass = 'score-poor';
  else scoreClass = 'score-bad';
  
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box 
        className={`analysis-score-circle ${scoreClass}`}
        sx={{ mb: 1 }}
      >
        {score}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
        {icon}
        <Typography variant="h6" component="div" sx={{ ml: 0.5 }}>
          {label}
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={score * 10} 
        sx={{ 
          height: 8, 
          borderRadius: 5,
          bgcolor: 'rgba(0,0,0,0.1)',
          '& .MuiLinearProgress-bar': {
            bgcolor: scoreClass === 'score-excellent' ? '#43a047' :
                    scoreClass === 'score-good' ? '#7cb342' :
                    scoreClass === 'score-average' ? '#fdd835' :
                    scoreClass === 'score-poor' ? '#fb8c00' : '#e53935'
          }
        }} 
      />
    </Box>
  );
};

function AnalysisPage() {
  const [productText, setProductText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!productText.trim()) {
      setError('Please enter product details to analyze.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Make API call to the backend
      const response = await axios.post('/api/analysis/analyze-text', { productText });
      setAnalysis(response.data);
    } catch (err) {
      console.error('Error analyzing product:', err);
      setError(err.response?.data?.message || 'An error occurred while analyzing the product. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box className="page-transition">
      <Box
        sx={{
          pt: 6,
          pb: 6,
          backgroundColor: 'primary.main',
          color: 'white',
        }}
        className="eco-gradient-bg"
      >
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h3"
            gutterBottom
            sx={{ fontWeight: 'bold', textAlign: 'center' }}
          >
            Analyze Environmental Impact
          </Typography>
          <Typography variant="h6" paragraph sx={{ mb: 4, textAlign: 'center' }}>
            Enter product details to receive an AI-powered environmental impact assessment
          </Typography>
        </Container>
      </Box>
      
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Product Information
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Please provide as much detail as possible about the product for the most accurate assessment.
            Include information about materials, manufacturing process, packaging, and origin if available.
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <TextField
              label="Product Details"
              multiline
              rows={6}
              fullWidth
              value={productText}
              onChange={(e) => setProductText(e.target.value)}
              placeholder="Example: This smartphone is made with an aluminum body, glass screen, and lithium-ion battery. It's manufactured in China and packaged in recycled cardboard with plastic film."
              sx={{ mb: 3 }}
              required
            />
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AnalyticsIcon />}
              disabled={loading || !productText.trim()}
              fullWidth
              sx={{ py: 1.5 }}
            >
              {loading ? 'Analyzing...' : 'Analyze Product'}
            </Button>
          </form>
        </Paper>
        
        {loading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Analyzing product details...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This may take a few moments as our AI evaluates the environmental impact.
            </Typography>
          </Box>
        )}
        
        {analysis && !loading && (
          <Card elevation={3} sx={{ mb: 4 }}>
            <Box sx={{ px: 3, py: 2, backgroundColor: 'primary.main', color: 'white' }}>
              <Typography variant="h5">
                Environmental Impact Analysis Results
              </Typography>
            </Box>
            
            <CardContent>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                centered
                sx={{ mb: 3 }}
              >
                <Tab icon={<AnalyticsIcon />} label="SCORES" />
                <Tab icon={<TipsAndUpdatesIcon />} label="INSIGHTS" />
              </Tabs>
              
              {activeTab === 0 && (
                <Box>
                  {/* Overall Score */}
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h4" gutterBottom>
                      Overall Environmental Score
                    </Typography>
                    <Box 
                      className={`analysis-score-circle ${
                        analysis.scores.overall >= 9 ? 'score-excellent' :
                        analysis.scores.overall >= 7 ? 'score-good' :
                        analysis.scores.overall >= 5 ? 'score-average' :
                        analysis.scores.overall >= 3 ? 'score-poor' : 'score-bad'
                      }`}
                      sx={{ width: 120, height: 120, fontSize: '2.5rem', mb: 2, mx: 'auto' }}
                    >
                      {analysis.scores.overall}
                    </Box>
                    <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto' }}>
                      {analysis.explanation.split('.')[0]}.
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 4 }} />
                  
                  {/* Individual Scores */}
                  <Box sx={{ my: 3 }}>
                    <Typography variant="h5" gutterBottom>
                      Environmental Impact Breakdown
                    </Typography>
                    <Grid container spacing={4} sx={{ mt: 2 }}>
                      <Grid item xs={12} md={4}>
                        <ScoreCircle 
                          score={analysis.scores.carbon} 
                          label="Carbon Footprint" 
                          icon={<RecyclingIcon sx={{ color: 'primary.main' }} />}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <ScoreCircle 
                          score={analysis.scores.water} 
                          label="Water Usage" 
                          icon={<WaterIcon sx={{ color: 'primary.main' }} />}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <ScoreCircle 
                          score={analysis.scores.resources} 
                          label="Resource Consumption" 
                          icon={<SpaIcon sx={{ color: 'primary.main' }} />}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              )}
              
              {activeTab === 1 && (
                <Box>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <EcoIcon sx={{ mr: 1, color: 'primary.main' }} />
                      Detailed Explanation
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.7 }}>
                      {analysis.explanation}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 4 }} />
                  
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <TipsAndUpdatesIcon sx={{ mr: 1, color: 'primary.main' }} />
                      Improvement Suggestions
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {analysis.suggestions.split('.').filter(s => s.trim()).map((suggestion, index) => (
                        <Alert 
                          key={index} 
                          severity="info" 
                          icon={<TipsAndUpdatesIcon />}
                          sx={{ mb: 2 }}
                        >
                          {suggestion.trim() + '.'}
                        </Alert>
                      ))}
                    </Box>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        )}
        
        <Paper elevation={1} sx={{ p: 3, bgcolor: 'background.paper', borderLeft: '4px solid', borderColor: 'primary.main' }}>
          <Typography variant="h6" gutterBottom>
            Tips for Accurate Analysis
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <Chip label="1" color="primary" size="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Include materials used in the product (metal, plastic, fabric types)
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <Chip label="2" color="primary" size="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Mention manufacturing location and processes if known
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <Chip label="3" color="primary" size="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Describe packaging materials and product lifespan
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Chip label="4" color="primary" size="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Note any eco-certifications or sustainability claims
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default AnalysisPage;