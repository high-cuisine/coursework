import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './components/Products';
import Cart from './components/Cart';
import Purchases from './components/Purchases';
import Store from './pages/Stores';
import Supply from './pages/Supplies';
import Reports from './pages/Reports';
import PurchaseManagement from './components/PurchaseManagement';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

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

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user?.role === 'admin' || user?.role === 'manager' ? <>{children}</> : <Navigate to="/" />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Products />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <PrivateRoute>
                      <Cart />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/purchases"
                  element={
                    <PrivateRoute>
                      <Purchases />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/purchase-management"
                  element={
                    <AdminRoute>
                      <PurchaseManagement />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/stores"
                  element={
                    <AdminRoute>
                      <Store />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/supplies"
                  element={
                    <AdminRoute>
                      <Supply />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <AdminRoute>
                      <Reports />
                    </AdminRoute>
                  }
                />
              </Routes>
            </Layout>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App; 