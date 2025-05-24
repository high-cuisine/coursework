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
import { Sale, Product, Store } from '../types';

export default function Sales() {
  const [saleList, setSaleList] = useState<Sale[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);
  const [storeList, setStoreList] = useState<Store[]>([]);
  const [open, setOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [formData, setFormData] = useState({
    productId: '',
    storeId: '',
    quantity: '',
    saleDate: '',
  });

  const loadSales = async () => {
    try {
        const data = await apiService.getSales();
      setSaleList(data);
    } catch (error) {
      console.error('Failed to load sales:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await apiService.getProducts();
      setProductList(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const loadStores = async () => {
    try {
      const data = await apiService.getStores();
      setStoreList(data);
    } catch (error) {
      console.error('Failed to load stores:', error);
    }
  };

  useEffect(() => {
    loadSales();
    loadProducts();
    loadStores();
  }, []);

  const handleOpen = (sale?: Sale) => {
    if (sale) {
      setEditingSale(sale);
      setFormData({
        productId: sale.productId.toString(),
        storeId: sale.storeId.toString(),
        quantity: sale.quantity.toString(),
        saleDate: sale.saleDate.split('T')[0],
      });
    } else {
      setEditingSale(null);
      setFormData({
        productId: '',
        storeId: '',
        quantity: '',
        saleDate: new Date().toISOString().split('T')[0],
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingSale(null);
    setFormData({
      productId: '',
      storeId: '',
      quantity: '',
      saleDate: '',
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
      const saleData = {
        productId: parseInt(formData.productId),
        storeId: parseInt(formData.storeId),
        quantity: parseInt(formData.quantity),
        saleDate: formData.saleDate,
      };

      if (editingSale) {
        await apiService.updateSale(editingSale.id, saleData);
      } else {
        await apiService.createSale(saleData);
      }

      handleClose();
      loadSales();
    } catch (error) {
      console.error('Failed to save sale:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await apiService.deleteSale(id);
        loadSales();
      } catch (error) {
        console.error('Failed to delete sale:', error);
      }
    }
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Sales
        </Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add Sale
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Store</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {saleList.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>
                  {productList.find((p) => p.id === sale.productId)?.productName}
                </TableCell>
                <TableCell>
                  {storeList.find((s) => s.id === sale.storeId)?.storeName}
                </TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(sale)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(sale.id)} color="error">
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
          {editingSale ? 'Edit Sale' : 'Add New Sale'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              margin="dense"
              name="productId"
              label="Product"
              select
              fullWidth
              required
              value={formData.productId}
              onChange={handleChange}
            >
              {productList.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.productName}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              name="storeId"
              label="Store"
              select
              fullWidth
              required
              value={formData.storeId}
              onChange={handleChange}
            >
              {storeList.map((store) => (
                <MenuItem key={store.id} value={store.id}>
                  {store.storeName}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              name="quantity"
              label="Quantity"
              type="number"
              fullWidth
              required
              value={formData.quantity}
              onChange={handleChange}
              inputProps={{ min: '1' }}
            />
            <TextField
              margin="dense"
              name="saleDate"
              label="Sale Date"
              type="date"
              fullWidth
              required
              value={formData.saleDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingSale ? 'Save' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
} 