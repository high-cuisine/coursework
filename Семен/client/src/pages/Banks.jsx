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
import { getBanks, createBank, updateBank, deleteBank } from '../services/api';

const columns = [
  { field: 'name', headerName: 'Name' },
  { field: 'bik', headerName: 'BIK' },
  { field: 'address', headerName: 'Address' },
];

const fields = [
  { name: 'name', label: 'Name', required: true },
  { name: 'bik', label: 'BIK', required: true },
  { name: 'address', label: 'Address', required: true },
];

function Banks() {
  const [open, setOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const { data: banks = [], isLoading } = useQuery({
    queryKey: ['banks'],
    queryFn: async () => {
      const response = await getBanks();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: createBank,
    onSuccess: () => {
      queryClient.invalidateQueries(['banks']);
      setOpen(false);
    },
    onError: (error) => {
      setError(error.response?.data?.error || 'Failed to create bank');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateBank(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['banks']);
      setOpen(false);
      setSelectedBank(null);
    },
    onError: (error) => {
      setError(error.response?.data?.error || 'Failed to update bank');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBank,
    onSuccess: () => {
      queryClient.invalidateQueries(['banks']);
    },
    onError: (error) => {
      setError(error.response?.data?.error || 'Failed to delete bank');
    },
  });

  const handleCreate = () => {
    setSelectedBank(null);
    setOpen(true);
  };

  const handleEdit = (bank) => {
    setSelectedBank(bank);
    setOpen(true);
  };

  const handleDelete = (bank) => {
    if (window.confirm('Are you sure you want to delete this bank?')) {
      deleteMutation.mutate(bank.bank_id);
    }
  };

  const handleSubmit = (values) => {
    if (selectedBank) {
      updateMutation.mutate({ id: selectedBank.bank_id, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Banks</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Add Bank
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={banks}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialog
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedBank(null);
        }}
        title={selectedBank ? 'Edit Bank' : 'Add Bank'}
        fields={fields}
        initialValues={selectedBank}
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

export default Banks; 