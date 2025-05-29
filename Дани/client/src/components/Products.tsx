import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Box,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { apiService } from '../services/api';
import { useCart } from '../contexts/CartContext';

interface Product {
  productid: number;
  productname: string;
  description: string;
  price: number;
  image_url: string;
  categoryid: number;
  categoryname: string;
  current_stock: number;
  store_id: number;
}

interface Category {
  categoryid: number;
  categoryname: string;
  productcount: number;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  const loadProducts = async () => {
    try {
      const data = await apiService.getProducts();
      setProducts(data);
      setFilteredProducts(data);
      // Initialize quantities with 1 for each product
      const initialQuantities = data.reduce((acc: { [key: number]: number }, product: Product) => {
        acc[product.productid] = 1;
        return acc;
      }, {} as { [key: number]: number });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error('Failed to load products:', error);
      setError('Ошибка при загрузке товаров');
    }
  };

  const loadCategories = async () => {
    try {
      const data = await apiService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
      setError('Ошибка при загрузке категорий');
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Фильтрация по категории
    if (selectedCategory !== '') {
      filtered = filtered.filter(product => product.categoryid === selectedCategory);
    }

    // Поиск по названию и описанию
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        (product.productname?.toLowerCase() || '').includes(query) ||
        (product.description?.toLowerCase() || '').includes(query)
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery]);

  const handleQuantityChange = (productId: number, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      setQuantities(prev => ({
        ...prev,
        [productId]: numValue
      }));
    }
  };

  const handleAddToCart = (product: Product) => {
    if (product.current_stock <= 0) {
      setError('Товар временно недоступен');
      return;
    }
    
    const quantity = quantities[product.productid];
    if (quantity > product.current_stock) {
      setError(`Доступно только ${product.current_stock} шт.`);
      return;
    }

    addToCart(product, quantity);
  };

  return (
    <Container>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Поиск товаров..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Категория</InputLabel>
          <Select
            value={selectedCategory}
            label="Категория"
            onChange={(e) => setSelectedCategory(e.target.value as number | '')}
          >
            <MenuItem value="">Все категории</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.categoryid} value={category.categoryid}>
                {category.categoryname} ({category.productcount})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.productid}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={product.image_url || 'https://via.placeholder.com/200'}
                alt={product.productname}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {product.productname}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {product.categoryname}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                  ₽{Number(product.price).toFixed(2)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    В наличии:
                  </Typography>
                  <Chip
                    label={product.current_stock > 0 ? `${product.current_stock} шт.` : 'Нет в наличии'}
                    color={product.current_stock > 0 ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    type="number"
                    size="small"
                    value={quantities[product.productid]}
                    onChange={(e) => handleQuantityChange(product.productid, e.target.value)}
                    inputProps={{ min: 1, max: product.current_stock }}
                    disabled={product.current_stock <= 0}
                    sx={{ width: '80px' }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.current_stock <= 0}
                    fullWidth
                  >
                    В корзину
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Products; 