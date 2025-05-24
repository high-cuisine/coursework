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
import { getCustomers, createCustomer, updateCustomer, deleteCustomer, getBanks } from '../services/api';

const columns = [
  { field: 'name', headerName: 'Name' },
  { field: 'address', headerName: 'Address' },
  { field: 'phone', headerName: 'Phone' },
  { field: 'bank_name', headerName: 'Bank' },
];

function Customers() {
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await getCustomers();
      return response.data;
    },
  });

  const { data: banks = [], isLoading: banksLoading } = useQuery({
    queryKey: ['banks'],
    queryFn: async () => {
      const response = await getBanks();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      setOpen(false);
    },
    onError: (error) => {
      setError(error.response?.data?.error || 'Failed to create customer');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      setOpen(false);
      setSelectedCustomer(null);
    },
    onError: (error) => {
      setError(error.response?.data?.error || 'Failed to update customer');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
    },
    onError: (error) => {
      setError(error.response?.data?.error || 'Failed to delete customer');
    },
  });

  const handleCreate = () => {
    setSelectedCustomer(null);
    setOpen(true);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setOpen(true);
  };

  const handleDelete = (customer) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      deleteMutation.mutate(customer.customer_id);
    }
  };

  const handleSubmit = (values) => {
    if (selectedCustomer) {
      updateMutation.mutate({ id: selectedCustomer.customer_id, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const fields = [
    { name: 'name', label: 'Name', required: true },
    { name: 'address', label: 'Address', required: true },
    { name: 'phone', label: 'Phone', required: true },
    {
      name: 'bank_id',
      label: 'Bank',
      required: true,
      select: true,
      options: banks.map((bank) => ({
        value: bank.bank_id,
        label: bank.name,
      })),
    },
  ];

  if (customersLoading || banksLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Customers</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Add Customer
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={customers.map((customer) => ({
          ...customer,
          bank_name: banks.find((bank) => bank.bank_id === customer.bank_id)?.name || 'N/A',
        }))}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialog
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedCustomer(null);
        }}
        title={selectedCustomer ? 'Edit Customer' : 'Add Customer'}
        fields={fields}
        initialValues={selectedCustomer}
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

export default Customers; 