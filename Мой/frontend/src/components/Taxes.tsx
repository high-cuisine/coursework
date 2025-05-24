import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { endpoints } from '../utils/api';

interface Tax {
  taxid: number;
  taxcode: string;
  taxname: string;
  rate: number;
  regulatorydocument: string;
  description: string;
  taxtype: string;
}

const Taxes: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedTax, setSelectedTax] = useState<Tax | null>(null);
  const [formData, setFormData] = useState<Partial<Tax>>({});
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: taxes, isLoading } = useQuery<Tax[]>({
    queryKey: ['taxes'],
    queryFn: async () => {
      const response = await api.get(endpoints.taxes);
      return response.data;
    },
  });

  const createMutation = useMutation<Tax, Error, Omit<Tax, 'taxid'>>({
    mutationFn: async (newTax) => {
      const response = await api.post(endpoints.taxes, newTax);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxes'] });
      handleClose();
    },
    onError: () => {
      setError('Failed to create tax');
    },
  });

  const updateMutation = useMutation<Tax, Error, Tax>({
    mutationFn: async (updatedTax) => {
      const response = await api.put(`${endpoints.taxes}/${updatedTax.taxid}`, updatedTax);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxes'] });
      handleClose();
    },
    onError: () => {
      setError('Failed to update tax');
    },
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await api.delete(`${endpoints.taxes}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxes'] });
    },
    onError: () => {
      setError('Failed to delete tax');
    },
  });

  const handleOpen = (tax?: Tax) => {
    if (tax) {
      setSelectedTax(tax);
      setFormData(tax);
    } else {
      setSelectedTax(null);
      setFormData({});
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTax(null);
    setFormData({});
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTax) {
      updateMutation.mutate({ ...selectedTax, ...formData });
    } else {
      createMutation.mutate(formData as Omit<Tax, 'taxid'>);
    }
  };

  const columns: GridColDef[] = [
    { field: 'taxid', headerName: 'ID', width: 70 },
    { field: 'taxcode', headerName: 'Tax Code', width: 130 },
    { field: 'taxname', headerName: 'Tax Name', width: 200 },
    { field: 'rate', headerName: 'Rate', width: 100 },
    { field: 'regulatorydocument', headerName: 'Regulatory Document', width: 200 },
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'taxtype', headerName: 'Tax Type', width: 130 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleOpen(params.row)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => deleteMutation.mutate(params.row.taxid)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Taxes</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add Tax
        </Button>
      </Box>

      <DataGrid
        rows={taxes || []}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        pageSizeOptions={[10]}
        checkboxSelection
        disableRowSelectionOnClick
        loading={isLoading}
        getRowId={(row) => row.taxid}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedTax ? 'Edit Tax' : 'Add New Tax'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Tax Code"
              value={formData.taxcode || ''}
              onChange={(e) => setFormData({ ...formData, taxcode: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Tax Name"
              value={formData.taxname || ''}
              onChange={(e) => setFormData({ ...formData, taxname: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Rate"
              type="number"
              value={formData.rate || ''}
              onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Regulatory Document"
              value={formData.regulatorydocument || ''}
              onChange={(e) => setFormData({ ...formData, regulatorydocument: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              label="Tax Type"
              value={formData.taxtype || ''}
              onChange={(e) => setFormData({ ...formData, taxtype: e.target.value })}
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedTax ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Taxes; 