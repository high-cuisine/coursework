import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import DataTable from '../components/DataTable';
import FormDialog from '../components/FormDialog';
import { getOrders, createOrder, updateOrder, deleteOrder, getCustomers } from '../services/api';

const columns = [
  { field: 'customer_name', headerName: 'Customer' },
  { field: 'order_date', headerName: 'Order Date' },
  { field: 'status', headerName: 'Status' },
];

function Orders() {
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await getOrders();
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

  const createMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
      setOpen(false);
    },
    onError: (error) => {
      setError(error.response?.data?.error || 'Failed to create order');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
      setOpen(false);
      setSelectedOrder(null);
    },
    onError: (error) => {
      setError(error.response?.data?.error || 'Failed to update order');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
    },
    onError: (error) => {
      setError(error.response?.data?.error || 'Failed to delete order');
    },
  });

  const handleCreate = () => {
    setSelectedOrder(null);
    setOpen(true);
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleDelete = (order) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      deleteMutation.mutate(order.order_id);
    }
  };

  const handleSubmit = (values) => {
    if (selectedOrder) {
      updateMutation.mutate({ id: selectedOrder.order_id, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const fields = [
    {
      name: 'customer_id',
      label: 'Customer',
      required: true,
      select: true,
      options: customers.map((customer) => ({
        value: customer.customer_id,
        label: customer.name,
      })),
    },
    {
      name: 'order_date',
      label: 'Order Date',
      type: 'date',
      required: true,
    },
    {
      name: 'status',
      label: 'Status',
      required: true,
      select: true,
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
      ],
    },
  ];

  if (ordersLoading || customersLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Orders</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Add Order
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={orders.map((order) => ({
          ...order,
          customer_name: customers.find((customer) => customer.customer_id === order.customer_id)?.name || 'N/A',
        }))}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialog
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedOrder(null);
        }}
        title={selectedOrder ? 'Edit Order' : 'Add Order'}
        fields={fields}
        initialValues={selectedOrder}
        onSubmit={handleSubmit}
      />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Orders; 