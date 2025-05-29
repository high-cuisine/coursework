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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import { Supply, Product, Store } from '../types';

const SupplyComponent: React.FC = () => {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    StoreID: '',
    ProductID: '',
    Quantity: '',
  });

  useEffect(() => {
    fetchSupplies();
    fetchProducts();
    fetchStores();
  }, []);

  const fetchSupplies = async () => {
    try {
      const response = await axios.get('http://localhost:3001/supplies');
      setSupplies(response.data);
    } catch (error) {
      console.error('Error fetching supplies:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await axios.get('http://localhost:3001/stores');
      setStores(response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ StoreID: '', ProductID: '', Quantity: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/supplies', {
        StoreID: parseInt(formData.StoreID),
        ProductID: parseInt(formData.ProductID),
        Quantity: parseInt(formData.Quantity),
      });
      fetchSupplies();
      handleClose();
    } catch (error) {
      console.error('Error creating supply:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Поставки</Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Добавить поставку
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Магазин</TableCell>
              <TableCell>Товар</TableCell>
              <TableCell align="right">Количество</TableCell>
              <TableCell align="right">Дата</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {supplies.map((supply) => (
              <TableRow key={supply.SupplyID}>
                <TableCell>{supply.Store?.StoreName}</TableCell>
                <TableCell>{supply.Product?.ProductName}</TableCell>
                <TableCell align="right">{supply.Quantity}</TableCell>
                <TableCell align="right">{formatDate(supply.SupplyDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Добавить поставку</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>Магазин</InputLabel>
              <Select
                value={formData.StoreID}
                onChange={(e) => setFormData({ ...formData, StoreID: e.target.value })}
                required
              >
                {stores.map((store) => (
                  <MenuItem key={store.StoreID} value={store.StoreID}>
                    {store.StoreName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Товар</InputLabel>
              <Select
                value={formData.ProductID}
                onChange={(e) => setFormData({ ...formData, ProductID: e.target.value })}
                required
              >
                {products.map((product) => (
                  <MenuItem key={product.ProductID} value={product.ProductID}>
                    {product.ProductName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Количество"
              type="number"
              value={formData.Quantity}
              onChange={(e) => setFormData({ ...formData, Quantity: e.target.value })}
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button type="submit" variant="contained" color="primary">
              Добавить
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default SupplyComponent; 