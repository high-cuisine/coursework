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
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';

const columns = [
  { field: 'name', headerName: 'Name' },
  { field: 'description', headerName: 'Description' },
  { field: 'price', headerName: 'Price' },
];

function Products() {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await getProducts();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      setOpen(false);
    },
    onError: (error) => {
      setError(error.response?.data?.error || 'Failed to create product');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      setOpen(false);
      setSelectedProduct(null);
    },
    onError: (error) => {
      setError(error.response?.data?.error || 'Failed to update product');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
    },
    onError: (error) => {
      setError(error.response?.data?.error || 'Failed to delete product');
    },
  });

  const handleCreate = () => {
    setSelectedProduct(null);
    setOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleDelete = (product) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(product.product_id);
    }
  };

  const handleSubmit = (values) => {
    if (selectedProduct) {
      updateMutation.mutate({ id: selectedProduct.product_id, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const fields = [
    { name: 'name', label: 'Name', required: true },
    { name: 'description', label: 'Description', required: true },
    { name: 'price', label: 'Price', type: 'number', required: true },
  ];

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Products</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Add Product
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialog
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedProduct(null);
        }}
        title={selectedProduct ? 'Edit Product' : 'Add Product'}
        fields={fields}
        initialValues={selectedProduct}
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

export default Products; 