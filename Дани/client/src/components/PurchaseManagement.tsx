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
  Select,
  MenuItem,
  Button,
  Alert,
} from '@mui/material';
import { apiService } from '../services/api';

interface Purchase {
  purchase_id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  total_amount: string | number;
  status_id: number;
  created_at: string;
  user_name: string;
  product_name: string;
  store_name: string;
  status_name: string;
}

interface PurchaseStatus {
  id: number;
  name: string;
}

const PurchaseManagement: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [statuses, setStatuses] = useState<PurchaseStatus[]>([]);
  const [error, setError] = useState<string | null>(null);

  const formatAmount = (amount: string | number): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return numAmount.toFixed(2);
  };

  const loadPurchases = async () => {
    try {
      setError(null);
      const data = await apiService.getPurchases();
      setPurchases(data);
    } catch (error) {
      console.error('Failed to load purchases:', error);
      setError('Ошибка при загрузке заказов');
    }
  };

  const loadStatuses = async () => {
    try {
      setError(null);
      const data = await apiService.getPurchaseStatuses();
      setStatuses(data);
    } catch (error) {
      console.error('Failed to load statuses:', error);
      setError('Ошибка при загрузке статусов');
    }
  };

  const handleStatusChange = async (purchaseId: number, statusId: number) => {
    try {
      setError(null);
      await apiService.updatePurchaseStatus(purchaseId, statusId);
      await loadPurchases(); // Перезагружаем данные
    } catch (error) {
      console.error('Failed to update purchase status:', error);
      setError('Ошибка при обновлении статуса заказа');
    }
  };

  useEffect(() => {
    loadPurchases();
    loadStatuses();
  }, []);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Управление заказами
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Пользователь</TableCell>
                <TableCell>Товар</TableCell>
                <TableCell align="right">Количество</TableCell>
                <TableCell align="right">Сумма</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Дата</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchases.map((purchase) => (
                <TableRow key={purchase.purchase_id}>
                  <TableCell>{purchase.purchase_id}</TableCell>
                  <TableCell>{purchase.user_name}</TableCell>
                  <TableCell>{purchase.product_name}</TableCell>
                  <TableCell align="right">{purchase.quantity}</TableCell>
                  <TableCell align="right">₽{formatAmount(purchase.total_amount)}</TableCell>
                  <TableCell>
                    <Select
                      value={purchase.status_id}
                      onChange={(e) => handleStatusChange(purchase.purchase_id, Number(e.target.value))}
                      size="small"
                    >
                      {statuses.map((status) => (
                        <MenuItem key={status.id} value={status.id}>
                          {status.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>{new Date(purchase.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default PurchaseManagement; 