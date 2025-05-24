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

interface Inspector {
  inspectorid: number;
  lastname: string;
  firstname: string;
  middlename: string;
  position: string;
  hiredate: string;
  accesslevel: string;
  departmentid: number;
}

interface Department {
  departmentid: number;
  name: string;
}

const Inspectors: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedInspector, setSelectedInspector] = useState<Inspector | null>(null);
  const [formData, setFormData] = useState<Partial<Inspector>>({});
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: inspectors, isLoading } = useQuery<Inspector[]>({
    queryKey: ['inspectors'],
    queryFn: async () => {
      const response = await api.get(endpoints.inspectors);
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

  const createMutation = useMutation<Inspector, Error, Omit<Inspector, 'inspectorid'>>({
    mutationFn: async (newInspector) => {
      const response = await api.post(endpoints.inspectors, newInspector);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspectors'] });
      handleClose();
    },
    onError: () => {
      setError('Failed to create inspector');
    },
  });

  const updateMutation = useMutation<Inspector, Error, Inspector>({
    mutationFn: async (updatedInspector) => {
      const response = await api.put(
        `${endpoints.inspectors}/${updatedInspector.inspectorid}`,
        updatedInspector
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspectors'] });
      handleClose();
    },
    onError: () => {
      setError('Failed to update inspector');
    },
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await api.delete(`${endpoints.inspectors}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspectors'] });
    },
    onError: () => {
      setError('Failed to delete inspector');
    },
  });

  const handleOpen = (inspector?: Inspector) => {
    if (inspector) {
      setSelectedInspector(inspector);
      setFormData(inspector);
    } else {
      setSelectedInspector(null);
      setFormData({});
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedInspector(null);
    setFormData({});
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInspector) {
      updateMutation.mutate({ ...selectedInspector, ...formData });
    } else {
      createMutation.mutate(formData as Omit<Inspector, 'inspectorid'>);
    }
  };

  const columns: GridColDef[] = [
    { field: 'inspectorid', headerName: 'ID', width: 70 },
    { field: 'lastname', headerName: 'Last Name', width: 130 },
    { field: 'firstname', headerName: 'First Name', width: 130 },
    { field: 'middlename', headerName: 'Middle Name', width: 130 },
    { field: 'position', headerName: 'Position', width: 130 },
    { field: 'hiredate', headerName: 'Hire Date', width: 130 },
    { field: 'accesslevel', headerName: 'Access Level', width: 130 },
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
            onClick={() => deleteMutation.mutate(params.row.inspectorid)}
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
        <Typography variant="h5">Inspectors</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add Inspector
        </Button>
      </Box>

      <DataGrid
        rows={inspectors || []}
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
        getRowId={(row) => row.inspectorid}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedInspector ? 'Edit Inspector' : 'Add New Inspector'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastname || ''}
              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstname || ''}
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Middle Name"
              value={formData.middlename || ''}
              onChange={(e) => setFormData({ ...formData, middlename: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Position"
              value={formData.position || ''}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Hire Date"
              type="date"
              value={formData.hiredate || ''}
              onChange={(e) => setFormData({ ...formData, hiredate: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Access Level</InputLabel>
              <Select
                value={formData.accesslevel || ''}
                label="Access Level"
                onChange={(e) => setFormData({ ...formData, accesslevel: e.target.value })}
                required
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="inspector">Inspector</MenuItem>
              </Select>
            </FormControl>
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
              {selectedInspector ? 'Update' : 'Create'}
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

export default Inspectors; 