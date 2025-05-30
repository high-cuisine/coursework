import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { apiService } from '../services/api';
import { Supply, Product, Store } from '../types';

export default function Supplies() {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [open, setOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState<Supply | null>(null);
  const [formData, setFormData] = useState({
    storeid: '',
    productid: '',
    quantity: '',
    supplydate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadSupplies();
    loadProducts();
    loadStores();
  }, []);

  const loadSupplies = async () => {
    try {
      const data = await apiService.getSupplies();
      console.log('Loaded supplies:', data);
      setSupplies(data);
    } catch (error) {
      console.error('Error loading supplies:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await apiService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadStores = async () => {
    try {
      const data = await apiService.getStores();
      setStores(data);
    } catch (error) {
      console.error('Error loading stores:', error);
    }
  };

  const handleOpen = (supply?: Supply) => {
    if (supply) {
      setEditingSupply(supply);
      setFormData({
        storeid: supply.storeid.toString(),
        productid: supply.productid.toString(),
        quantity: supply.quantity.toString(),
        supplydate: new Date(supply.supplydate).toISOString().split('T')[0],
      });
    } else {
      setEditingSupply(null);
      setFormData({
        storeid: '',
        productid: '',
        quantity: '',
        supplydate: new Date().toISOString().split('T')[0],
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingSupply(null);
    setFormData({
      storeid: '',
      productid: '',
      quantity: '',
      supplydate: new Date().toISOString().split('T')[0],
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const supplyData = {
        storeid: parseInt(formData.storeid),
        productid: parseInt(formData.productid),
        quantity: parseInt(formData.quantity),
        supplydate: formData.supplydate
      };

      console.log('Submitting supply data:', supplyData); // Для отладки

      if (editingSupply) {
        await apiService.updateSupply(editingSupply.supplyid, supplyData);
      } else {
        await apiService.createSupply(supplyData);
      }
      handleClose();
      await loadSupplies(); // Перезагружаем данные после изменения
    } catch (error) {
      console.error('Error saving supply:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this supply?')) {
      try {
        await apiService.deleteSupply(id);
        loadSupplies();
      } catch (error) {
        console.error('Error deleting supply:', error);
      }
    }
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Поставки
          </Typography>
          <Button variant="contained" color="primary" onClick={() => handleOpen()}>
            Добавить поставку
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Товар</TableCell>
                <TableCell>Магазин</TableCell>
                <TableCell>Количество</TableCell>
                <TableCell>Дата поставки</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {supplies.map((supply) => (
                <TableRow key={`supply-${supply.supplyid}`}>
                  <TableCell>{supply.supplyid}</TableCell>
                  <TableCell>{supply.productname}</TableCell>
                  <TableCell>{supply.storename}</TableCell>
                  <TableCell>{supply.quantity}</TableCell>
                  <TableCell>
                    {supply.supplydate ? new Date(supply.supplydate).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    }) : 'Нет даты'}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(supply)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(supply.supplyid)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {editingSupply ? 'Редактировать поставку' : 'Добавить поставку'}
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                select
                label="Товар"
                name="productid"
                value={formData.productid}
                onChange={handleChange}
              >
                {products.map((product) => (
                  <MenuItem key={product.productid} value={product.productid}>
                    {product.productname}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                margin="normal"
                required
                fullWidth
                select
                label="Магазин"
                name="storeid"
                value={formData.storeid}
                onChange={handleChange}
              >
                {stores.map((store) => (
                  <MenuItem key={store.storeid} value={store.storeid}>
                    {store.storename}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Количество"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Дата поставки"
                name="supplydate"
                type="date"
                value={formData.supplydate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {editingSupply ? 'Сохранить' : 'Добавить'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
} 