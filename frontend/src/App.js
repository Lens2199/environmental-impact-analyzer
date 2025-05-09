import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import context provider
import { AppProvider } from './context/AppContext';

// Import components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Notifications from './components/common/Notifications';

// Import pages
import HomePage from './pages/HomePage';
import ProductSearchPage from './pages/ProductSearchPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AnalysisPage from './pages/AnalysisPage';
import ComparisonPage from './pages/ComparisonPage';
import AboutPage from './pages/AboutPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import SustainabilityGuidePage from './pages/SustainabilityGuidePage';

// Create a theme with eco-friendly colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Green
      light: '#60ad5e',
      dark: '#005005',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00796b', // Teal
      light: '#48a999',
      dark: '#004c40',
      contrastText: '#ffffff',
    },
    success: {
      main: '#388e3c', // Green
      light: '#81c784',
      dark: '#1b5e20',
    },
    warning: {
      main: '#ffc107', // Amber
      light: '#ffecb3',
      dark: '#ff8f00',
    },
    info: {
      main: '#0288d1', // Blue
      light: '#b3e5fc',
      dark: '#01579b',
    },
    error: {
      main: '#d32f2f', // Red
      light: '#ef5350',
      dark: '#b71c1c',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Router>
          <Header />
          <main style={{ minHeight: 'calc(100vh - 130px)', padding: '0 0 24px 0' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<ProductSearchPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/analyze" element={<AnalysisPage />} />
              <Route path="/compare" element={<ComparisonPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/products/add" element={<AddProductPage />} />
              <Route path="/products/:id/edit" element={<EditProductPage />} />
              <Route path="/guide" element={<SustainabilityGuidePage />} />
            </Routes>
          </main>
          <Footer />
          <Notifications />
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;