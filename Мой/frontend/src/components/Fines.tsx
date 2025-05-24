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

interface Fine {
  fineid: number;
  fineamount: number;
  chargedate: string;
  paymentdeadline: string;
  paymentstatus: string;
  paymentdate: string | null;
  violationid: number;
}

const Fines: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedFine, setSelectedFine] = useState<Fine | null>(null);
  const [formData, setFormData] = useState<Partial<Fine>>({});
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: fines, isLoading } = useQuery<Fine[]>({
    queryKey: ['fines'],
    queryFn: async () => {
      const response = await api.get(endpoints.fines);
      return response.data;
    },
  });

  const createMutation = useMutation<Fine, Error, Omit<Fine, 'fineid'>>({
    mutationFn: async (newFine) => {
      const response = await api.post(endpoints.fines, newFine);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fines'] });
      handleClose();
    },
    onError: () => {
      setError('Failed to create fine');
    },
  });

  const updateMutation = useMutation<Fine, Error, Fine>({
    mutationFn: async (updatedFine) => {
      const response = await api.put(`${endpoints.fines}/${updatedFine.fineid}`, updatedFine);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fines'] });
      handleClose();
    },
    onError: () => {
      setError('Failed to update fine');
    },
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await api.delete(`${endpoints.fines}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fines'] });
    },
    onError: () => {
      setError('Failed to delete fine');
    },
  });

  const handleOpen = (fine?: Fine) => {
    if (fine) {
      setSelectedFine(fine);
      setFormData(fine);
    } else {
      setSelectedFine(null);
      setFormData({});
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFine(null);
    setFormData({});
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFine) {
      updateMutation.mutate({ ...selectedFine, ...formData });
    } else {
      createMutation.mutate(formData as Omit<Fine, 'fineid'>);
    }
  };

  const columns: GridColDef[] = [
    { field: 'fineid', headerName: 'ID', width: 70 },
    { field: 'fineamount', headerName: 'Amount', width: 130 },
    { field: 'chargedate', headerName: 'Charge Date', width: 130 },
    { field: 'paymentdeadline', headerName: 'Payment Deadline', width: 130 },
    { field: 'paymentstatus', headerName: 'Payment Status', width: 130 },
    { field: 'paymentdate', headerName: 'Payment Date', width: 130 },
    { field: 'violationid', headerName: 'Violation ID', width: 130 },
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
            onClick={() => deleteMutation.mutate(params.row.fineid)}
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
        <Typography variant="h5">Fines</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add Fine
        </Button>
      </Box>

      <DataGrid
        rows={fines || []}
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
        getRowId={(row) => row.fineid}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedFine ? 'Edit Fine' : 'Add New Fine'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Fine Amount"
              type="number"
              value={formData.fineamount || ''}
              onChange={(e) => setFormData({ ...formData, fineamount: parseFloat(e.target.value) })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Charge Date"
              type="date"
              value={formData.chargedate || ''}
              onChange={(e) => setFormData({ ...formData, chargedate: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Payment Deadline"
              type="date"
              value={formData.paymentdeadline || ''}
              onChange={(e) => setFormData({ ...formData, paymentdeadline: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Payment Status"
              value={formData.paymentstatus || ''}
              onChange={(e) => setFormData({ ...formData, paymentstatus: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Payment Date"
              type="date"
              value={formData.paymentdate || ''}
              onChange={(e) => setFormData({ ...formData, paymentdate: e.target.value || null })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Violation ID"
              type="number"
              value={formData.violationid || ''}
              onChange={(e) => setFormData({ ...formData, violationid: parseInt(e.target.value) })}
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedFine ? 'Update' : 'Create'}
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

export default Fines; 