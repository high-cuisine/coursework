import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  AccountBalance as BankIcon,
  People as CustomerIcon,
  LocalShipping as SupplierIcon,
  Inventory as ProductIcon,
  ShoppingCart as OrderIcon,
} from '@mui/icons-material';
import {
  getBanks,
  getCustomers,
  getSuppliers,
  getProducts,
  getOrders,
} from '../services/api';

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          backgroundColor: `${color}.light`,
          borderRadius: '50%',
          p: 1,
          display: 'flex',
        }}
      >
        <Icon sx={{ color: `${color}.main` }} />
      </Box>
      <Box>
        <Typography variant="h6">{value}</Typography>
        <Typography color="text.secondary">{title}</Typography>
      </Box>
    </Paper>
  );
}

function Dashboard() {
  const { data: banks = [], isLoading: banksLoading } = useQuery({
    queryKey: ['banks'],
    queryFn: async () => {
      const response = await getBanks();
      return response.data;
    },
  });

  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await getCustomers();
      return response.data;
    },
  });

  const { data: suppliers = [], isLoading: suppliersLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const response = await getSuppliers();
      return response.data;
    },
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await getProducts();
      return response.data;
    },
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await getOrders();
      return response.data;
    },
  });

  const isLoading =
    banksLoading ||
    customersLoading ||
    suppliersLoading ||
    productsLoading ||
    ordersLoading;

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Banks"
            value={banks.length}
            icon={BankIcon}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Customers"
            value={customers.length}
            icon={CustomerIcon}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Suppliers"
            value={suppliers.length}
            icon={SupplierIcon}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Products"
            value={products.length}
            icon={ProductIcon}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Orders"
            value={orders.length}
            icon={OrderIcon}
            color="info"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 