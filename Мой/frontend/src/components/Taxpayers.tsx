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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { endpoints } from '../utils/api';

interface Taxpayer {
  taxpayerid: number;
  type: string;
  fullname: string;
  taxid: string;
  registrationaddress: string;
  phone: string;
  email: string;
  registrationdate: string;
  departmentid: number;
}

interface Department {
  departmentid: number;
  name: string;
}

const Taxpayers: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedTaxpayer, setSelectedTaxpayer] = useState<Taxpayer | null>(null);
  const [formData, setFormData] = useState<Partial<Taxpayer>>({});
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: taxpayers, isLoading } = useQuery<Taxpayer[]>({
    queryKey: ['taxpayers'],
    queryFn: async () => {
      const response = await api.get(endpoints.taxpayers);
      return response.data;
    },
  });

  const { data: departments } = useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: async () => {
      const response = await api.get(endpoints.departments);
      return response.data;
    },
  });

  const createMutation = useMutation<Taxpayer, Error, Omit<Taxpayer, 'taxpayerid'>>({
    mutationFn: async (newTaxpayer) => {
      const response = await api.post(endpoints.taxpayers, newTaxpayer);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxpayers'] });
      handleClose();
    },
    onError: () => {
      setError('Failed to create taxpayer');
    },
  });

  const updateMutation = useMutation<Taxpayer, Error, Taxpayer>({
    mutationFn: async (updatedTaxpayer) => {
      const response = await api.put(
        `${endpoints.taxpayers}/${updatedTaxpayer.taxpayerid}`,
        updatedTaxpayer
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxpayers'] });
      handleClose();
    },
    onError: () => {
      setError('Failed to update taxpayer');
    },
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await api.delete(`${endpoints.taxpayers}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxpayers'] });
    },
    onError: () => {
      setError('Failed to delete taxpayer');
    },
  });

  const handleOpen = (taxpayer?: Taxpayer) => {
    if (taxpayer) {
      setSelectedTaxpayer(taxpayer);
      setFormData(taxpayer);
    } else {
      setSelectedTaxpayer(null);
      setFormData({});
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTaxpayer(null);
    setFormData({});
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTaxpayer) {
      updateMutation.mutate({ ...selectedTaxpayer, ...formData });
    } else {
      createMutation.mutate(formData as Omit<Taxpayer, 'taxpayerid'>);
    }
  };

  const columns: GridColDef[] = [
    { field: 'taxpayerid', headerName: 'ID', width: 70 },
    { field: 'type', headerName: 'Type', width: 130 },
    { field: 'fullname', headerName: 'Full Name', width: 200 },
    { field: 'taxid', headerName: 'Tax ID', width: 130 },
    { field: 'registrationaddress', headerName: 'Address', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 130 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'registrationdate', headerName: 'Registration Date', width: 130 },
    { field: 'departmentid', headerName: 'Department ID', width: 130 },
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
            onClick={() => deleteMutation.mutate(params.row.taxpayerid)}
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
        <Typography variant="h5">Taxpayers</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add Taxpayer
        </Button>
      </Box>

      <DataGrid
        rows={taxpayers || []}
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
        getRowId={(row) => row.taxpayerid}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedTaxpayer ? 'Edit Taxpayer' : 'Add New Taxpayer'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type || ''}
                label="Type"
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <MenuItem value="individual">Individual</MenuItem>
                <MenuItem value="company">Company</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.fullname || ''}
              onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Tax ID"
              value={formData.taxid || ''}
              onChange={(e) => setFormData({ ...formData, taxid: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Registration Address"
              value={formData.registrationaddress || ''}
              onChange={(e) => setFormData({ ...formData, registrationaddress: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Registration Date"
              type="date"
              value={formData.registrationdate || ''}
              onChange={(e) => setFormData({ ...formData, registrationdate: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Department</InputLabel>
              <Select
                value={formData.departmentid || ''}
                label="Department"
                onChange={(e) => setFormData({ ...formData, departmentid: Number(e.target.value) })}
                required
              >
                {departments?.map((department) => (
                  <MenuItem key={department.departmentid} value={department.departmentid}>
                    {department.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedTaxpayer ? 'Update' : 'Create'}
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

export default Taxpayers; 