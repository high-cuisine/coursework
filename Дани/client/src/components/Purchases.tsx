import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Purchase {
  purchase_id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  total_amount: string | number;
  status_id: number;
  created_at: string;
  product_name: string;
  status_name: string;
}

const Purchases: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const loadPurchases = async () => {
    try {
      setError(null);
      const data = await apiService.getPurchases();
      // Фильтруем заказы только текущего пользователя
      const userPurchases = data.filter((purchase: Purchase) => purchase.user_id === user?.userid);
      setPurchases(userPurchases);
    } catch (error) {
      console.error('Failed to load purchases:', error);
      setError('Ошибка при загрузке заказов');
    }
  };

  useEffect(() => {
    loadPurchases();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: string | number): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return numAmount.toFixed(2);
  };

  if (purchases.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5">История покупок пуста</Typography>
          <Box sx={{ mt: 2 }}>
            <Chip
              label="Перейти к товарам"
              color="primary"
              onClick={() => navigate('/')}
              clickable
            />
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        История покупок
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Дата</TableCell>
              <TableCell>Товар</TableCell>
              <TableCell align="right">Количество</TableCell>
              <TableCell align="right">Сумма</TableCell>
              <TableCell>Статус</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchases.map((purchase) => (
              <TableRow key={purchase.purchase_id}>
                <TableCell>{formatDate(purchase.created_at)}</TableCell>
                <TableCell>{purchase.product_name}</TableCell>
                <TableCell align="right">{purchase.quantity}</TableCell>
                <TableCell align="right">₽{formatAmount(purchase.total_amount)}</TableCell>
                <TableCell>{purchase.status_name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Purchases; 