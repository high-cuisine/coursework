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
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier, getBanks } from '../services/api';

const columns = [
  { field: 'name', headerName: 'Name' },
  { field: 'address', headerName: 'Address' },
  { field: 'phone', headerName: 'Phone' },
  { field: 'bank_name', headerName: 'Bank' },
];

function Suppliers() {
  const [open, setOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const { data: suppliers = [], isLoading: suppliersLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const response = await getSuppliers();
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
    mutationFn: createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries(['suppliers']);
      setOpen(false);
    },
    onError: (error) => {
      setError(error.response?.data?.error || 'Failed to create supplier');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateSupplier(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['suppliers']);
      setOpen(false);
      setSelectedSupplier(null);
    },
    onError: (error) => {
      setError(error.response?.data?.error || 'Failed to update supplier');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries(['suppliers']);
    },
    onError: (error) => {
      setError(error.response?.data?.error || 'Failed to delete supplier');
    },
  });

  const handleCreate = () => {
    setSelectedSupplier(null);
    setOpen(true);
  };

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setOpen(true);
  };

  const handleDelete = (supplier) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      deleteMutation.mutate(supplier.supplier_id);
    }
  };

  const handleSubmit = (values) => {
    if (selectedSupplier) {
      updateMutation.mutate({ id: selectedSupplier.supplier_id, data: values });
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

  if (suppliersLoading || banksLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Suppliers</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Add Supplier
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={suppliers.map((supplier) => ({
          ...supplier,
          bank_name: banks.find((bank) => bank.bank_id === supplier.bank_id)?.name || 'N/A',
        }))}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialog
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedSupplier(null);
        }}
        title={selectedSupplier ? 'Edit Supplier' : 'Add Supplier'}
        fields={fields}
        initialValues={selectedSupplier}
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

export default Suppliers; 