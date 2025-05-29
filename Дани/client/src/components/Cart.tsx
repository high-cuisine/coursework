import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  IconButton,
  TextField,
  Divider,
  Alert,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);
  const { user } = useAuth();

  const handleQuantityChange = (productId: number, value: string) => {
    const quantity = parseInt(value);
    if (!isNaN(quantity) && quantity > 0) {
      updateQuantity(productId, quantity);
    }
  };

  const handleCheckout = async () => {
    try {
      setError(null);
      
      if (!user) {
        setError('Необходимо войти в систему');
        return;
      }

      // Проверяем наличие всех товаров
      for (const item of items) {
        if (!item.product.store_id) {
          setError(`Товар "${item.product.productname}" не привязан к магазину`);
          return;
        }
        if (item.quantity > item.product.current_stock) {
          setError(`Товар "${item.product.productname}" доступен только в количестве ${item.product.current_stock} шт.`);
          return;
        }
      }

      // Создаем заказ для каждого товара
      for (const item of items) {
        const price = typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price;
        await apiService.createPurchase({
          user_id: user.userid,
          store_id: item.product.store_id,
          product_id: item.product.productid,
          quantity: item.quantity,
          total_amount: price * item.quantity,
        });
      }

      clearCart();
      navigate('/purchases');
    } catch (error) {
      console.error('Failed to create purchase:', error);
      setError('Ошибка при создании заказа');
    }
  };

  const total = items.reduce((sum, item) => {
    const price = typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toFixed(2);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Корзина
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {items.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center">
          Корзина пуста
        </Typography>
      ) : (
        <>
          {items.map((item) => (
            <Card key={item.product.productid} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6">{item.product.productname}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      В наличии: {item.product.current_stock} шт.
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ₽{formatPrice(item.product.price)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                      type="number"
                      size="small"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.product.productid, e.target.value)}
                      inputProps={{ min: 1, max: item.product.current_stock }}
                      sx={{ width: '80px' }}
                    />
                    <IconButton
                      color="error"
                      onClick={() => removeFromCart(item.product.productid)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">
              Итого: ₽{total.toFixed(2)}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleCheckout}
            >
              Оформить заказ
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Cart; 