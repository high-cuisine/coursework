import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  Alert,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { apiService } from '../services/api';

interface SalesReportItem {
  date: string;
  total_sales: number;
  total_revenue: string | number;
  status_name: string;
  completed_sales: number;
  completed_revenue: string | number;
}

interface InventoryItem {
  productid: number;
  productname: string;
  price: number;
  categoryname: string;
  current_stock: number;
  description?: string;
  image_url?: string;
  categoryid: number;
}

interface Store {
  storeid: number;
  storename: string;
}

interface StockEdit {
  id: number;
  value: number;
  store_id: number;
}

export default function Reports() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [salesReport, setSalesReport] = useState<SalesReportItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingStock, setEditingStock] = useState<StockEdit | null>(null);
  const [stores, setStores] = useState<Store[]>([]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'startDate') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  const loadSalesReport = async () => {
    try {
      setError(null);
      const data = await apiService.getSalesReport(startDate, endDate);
      console.log('Sales report data:', data);
      setSalesReport(data);
    } catch (error) {
      console.error('Failed to load sales report:', error);
      setError('Ошибка при загрузке отчета о продажах');
    }
  };

  const loadInventory = async () => {
    try {
      setError(null);
      const data = await apiService.getProducts();
      console.log('Inventory data:', data);
      setInventory(data);
    } catch (error) {
      console.error('Failed to load inventory:', error);
      setError('Ошибка при загрузке данных о запасах');
    }
  };

  const loadStores = async () => {
    try {
      const data = await apiService.getStores();
      setStores(data);
    } catch (error) {
      console.error('Failed to load stores:', error);
    }
  };

  const handleEditStock = (id: number, currentStock: number) => {
    setEditingStock({ id, value: currentStock, store_id: stores[0]?.storeid || 1 });
  };

  const handleSaveStock = async () => {
    if (!editingStock) return;

    try {
      setError(null);
      await apiService.updateProductStock(
        editingStock.id,
        editingStock.store_id,
        editingStock.value
      );
      await loadInventory();
      setEditingStock(null);
    } catch (error) {
      console.error('Failed to update stock:', error);
      setError('Ошибка при обновлении количества товара');
    }
  };

  const handleCancelEdit = () => {
    setEditingStock(null);
  };

  const formatCurrency = (value: string | number | undefined | null): string => {
    if (value === undefined || value === null) return '₽0.00';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '₽0.00';
    return `₽${numValue.toFixed(2)}`;
  };

  useEffect(() => {
    loadInventory();
    loadStores();
  }, []);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Отчеты
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Диапазон дат
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                name="startDate"
                label="Начальная дата"
                type="date"
                value={startDate}
                onChange={handleDateChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="endDate"
                label="Конечная дата"
                type="date"
                value={endDate}
                onChange={handleDateChange}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={loadSalesReport}
                disabled={!startDate || !endDate}
              >
                Загрузить отчет о продажах
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={loadInventory}
              >
                Обновить данные о запасах
              </Button>
            </Box>
          </Paper>
        </Box>

        {salesReport.length > 0 && (
          <Box>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Отчет о продажах
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Дата</TableCell>
                        <TableCell>Статус</TableCell>
                        <TableCell align="right">Всего продаж</TableCell>
                        <TableCell align="right">Общая выручка</TableCell>
                        <TableCell align="right">Завершенные продажи</TableCell>
                        <TableCell align="right">Выручка по завершенным</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {salesReport.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                          <TableCell>{item.status_name}</TableCell>
                          <TableCell align="right">{item.total_sales}</TableCell>
                          <TableCell align="right">{formatCurrency(item.total_revenue)}</TableCell>
                          <TableCell align="right">{item.completed_sales}</TableCell>
                          <TableCell align="right">{formatCurrency(item.completed_revenue)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Box>
        )}

        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Текущие запасы
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Товар</TableCell>
                      <TableCell>Категория</TableCell>
                      <TableCell align="right">Цена</TableCell>
                      <TableCell align="right">Количество на складе</TableCell>
                      <TableCell align="right">Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inventory.map((item) => (
                      <TableRow key={item.productid}>
                        <TableCell>{item.productname}</TableCell>
                        <TableCell>{item.categoryname}</TableCell>
                        <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                        <TableCell align="right">
                          {editingStock?.id === item.productid ? (
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                              <FormControl sx={{ minWidth: 120 }}>
                                <InputLabel>Магазин</InputLabel>
                                <Select
                                  value={editingStock.store_id}
                                  onChange={(e) => setEditingStock({
                                    ...editingStock,
                                    store_id: Number(e.target.value)
                                  })}
                                  label="Магазин"
                                >
                                  {stores.map((store) => (
                                    <MenuItem key={store.storeid} value={store.storeid}>
                                      {store.storename}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              <TextField
                                type="number"
                                value={editingStock.value}
                                onChange={(e) => setEditingStock({
                                  ...editingStock,
                                  value: Number(e.target.value)
                                })}
                                size="small"
                                sx={{ width: '100px' }}
                              />
                            </Box>
                          ) : (
                            item.current_stock
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {editingStock?.id === item.productid ? (
                            <>
                              <IconButton onClick={handleSaveStock} color="primary">
                                <SaveIcon />
                              </IconButton>
                              <IconButton onClick={handleCancelEdit} color="error">
                                <CancelIcon />
                              </IconButton>
                            </>
                          ) : (
                            <IconButton
                              onClick={() => handleEditStock(item.productid, item.current_stock)}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
} 