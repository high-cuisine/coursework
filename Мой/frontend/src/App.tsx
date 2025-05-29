import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import Taxpayers from './components/Taxpayers';
import Inspectors from './components/Inspectors';
import Violations from './components/Violations';
import Departments from './components/Departments';
import Taxes from './components/Taxes';
import Fines from './components/Fines';
import Properties from './components/Properties';
import TaxpayerDashboard from './components/TaxpayerDashboard';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const queryClient = new QueryClient();

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const DefaultRoute: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  switch (user.role) {
    case 'taxpayer':
      return <Navigate to="/dashboard" />;
    case 'admin':
    case 'inspector':
      return <Navigate to="/taxpayers" />;
    default:
      return <Navigate to="/login" />;
  }
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Navigation />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Taxpayer routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['taxpayer']}>
                    <TaxpayerDashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* Admin routes */}
              <Route
                path="/taxpayers"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'inspector']}>
                    <Taxpayers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inspectors"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Inspectors />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/departments"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Departments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/taxes"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Taxes />
                  </ProtectedRoute>
                }
              />
              
              {/* Inspector routes */}
              <Route
                path="/violations"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'inspector']}>
                    <Violations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/fines"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'inspector']}>
                    <Fines />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/properties"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'inspector']}>
                    <Properties />
                  </ProtectedRoute>
                }
              />
              
              {/* Default route */}
              <Route path="/" element={<DefaultRoute />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App; 