import React, { useState, useMemo } from 'react';
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
import Filter from './Filter';

interface Violation {
  violationid: number;
  violationdate: string;
  violationperiod: string;
  nonpaymentamount: number;
  violationdescription: string;
  status: string;
  paymentoverdue: boolean;
  taxpayerid: number;
  taxid: number;
  inspectorid: number;
}

interface Taxpayer {
  taxpayerid: number;
  fullname: string;
}

interface Tax {
  taxid: number;
  taxname: string;
}

interface Inspector {
  inspectorid: number;
  firstname: string;
  lastname: string;
}

const Violations: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);
  const [formData, setFormData] = useState<Partial<Violation>>({});
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const queryClient = useQueryClient();

  const { data: violations, isLoading } = useQuery<Violation[]>({
    queryKey: ['violations'],
    queryFn: async () => {
      const response = await api.get(endpoints.violations);
      return response.data;
    },
  });

  const { data: taxpayers } = useQuery<Taxpayer[]>({
    queryKey: ['taxpayers'],
    queryFn: async () => {
      const response = await api.get(endpoints.taxpayers);
      return response.data;
    },
  });

  const { data: taxes } = useQuery<Tax[]>({
    queryKey: ['taxes'],
    queryFn: async () => {
      const response = await api.get(endpoints.taxes);
      return response.data;
    },
  });

  const { data: inspectors } = useQuery<Inspector[]>({
    queryKey: ['inspectors'],
    queryFn: async () => {
      const response = await api.get(endpoints.inspectors);
      return response.data;
    },
  });

  const createMutation = useMutation<Violation, Error, Omit<Violation, 'violationid'>>({
    mutationFn: async (newViolation) => {
      const response = await api.post(endpoints.violations, newViolation);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['violations'] });
      handleClose();
    },
    onError: () => {
      setError('Failed to create violation');
    },
  });

  const updateMutation = useMutation<Violation, Error, Violation>({
    mutationFn: async (updatedViolation) => {
      const response = await api.put(
        `${endpoints.violations}/${updatedViolation.violationid}`,
        updatedViolation
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['violations'] });
      handleClose();
    },
    onError: () => {
      setError('Failed to update violation');
    },
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await api.delete(`${endpoints.violations}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['violations'] });
    },
    onError: () => {
      setError('Failed to delete violation');
    },
  });

  const handleOpen = (violation?: Violation) => {
    if (violation) {
      setSelectedViolation(violation);
      setFormData(violation);
    } else {
      setSelectedViolation(null);
      setFormData({});
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedViolation(null);
    setFormData({});
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedViolation) {
      updateMutation.mutate({ ...selectedViolation, ...formData });
    } else {
      createMutation.mutate(formData as Omit<Violation, 'violationid'>);
    }
  };

  const columns: GridColDef[] = [
    { field: 'violationid', headerName: 'ID', width: 70 },
    { field: 'violationdate', headerName: 'Date', width: 130 },
    { field: 'violationperiod', headerName: 'Period', width: 130 },
    { field: 'nonpaymentamount', headerName: 'Amount', width: 130 },
    { field: 'violationdescription', headerName: 'Description', width: 200 },
    { field: 'status', headerName: 'Status', width: 130 },
    { field: 'paymentoverdue', headerName: 'Overdue', width: 100, type: 'boolean' },
    { field: 'taxpayerid', headerName: 'Taxpayer ID', width: 130 },
    { field: 'taxid', headerName: 'Tax ID', width: 130 },
    { field: 'inspectorid', headerName: 'Inspector ID', width: 130 },
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
            onClick={() => deleteMutation.mutate(params.row.violationid)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const filterFields = [
    { field: 'description', label: 'Description' },
    { field: 'status', label: 'Status' },
    { field: 'severity', label: 'Severity' },
    { field: 'taxpayerid', label: 'Taxpayer ID' },
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleFilterReset = () => {
    setFilters({});
  };

  const filteredViolations = useMemo(() => {
    if (!violations) return [];
    
    return violations.filter(violation => {
      return Object.entries(filters).every(([field, value]) => {
        if (!value) return true;
        const fieldValue = String(violation[field as keyof Violation]).toLowerCase();
        return fieldValue.includes(value.toLowerCase());
      });
    });
  }, [violations, filters]);

  return (
    <Box sx={{ height: 600, width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Violations</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add Violation
        </Button>
      </Box>

      <Filter
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleFilterReset}
        filterFields={filterFields}
      />

      <DataGrid
        rows={filteredViolations}
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
        getRowId={(row) => row.violationid}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedViolation ? 'Edit Violation' : 'Add New Violation'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Violation Date"
              type="date"
              value={formData.violationdate || ''}
              onChange={(e) => setFormData({ ...formData, violationdate: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Violation Period"
              value={formData.violationperiod || ''}
              onChange={(e) => setFormData({ ...formData, violationperiod: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Non-payment Amount"
              type="number"
              value={formData.nonpaymentamount || ''}
              onChange={(e) => setFormData({ ...formData, nonpaymentamount: parseFloat(e.target.value) })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={formData.violationdescription || ''}
              onChange={(e) => setFormData({ ...formData, violationdescription: e.target.value })}
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status || ''}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
                <MenuItem value="under_review">Under Review</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Payment Overdue</InputLabel>
              <Select
                value={formData.paymentoverdue ? 'true' : 'false'}
                label="Payment Overdue"
                onChange={(e) => setFormData({ ...formData, paymentoverdue: e.target.value === 'true' })}
                required
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Taxpayer</InputLabel>
              <Select
                value={formData.taxpayerid || ''}
                label="Taxpayer"
                onChange={(e) => setFormData({ ...formData, taxpayerid: Number(e.target.value) })}
                required
              >
                {taxpayers?.map((taxpayer) => (
                  <MenuItem key={taxpayer.taxpayerid} value={taxpayer.taxpayerid}>
                    {taxpayer.fullname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Tax</InputLabel>
              <Select
                value={formData.taxid || ''}
                label="Tax"
                onChange={(e) => setFormData({ ...formData, taxid: Number(e.target.value) })}
                required
              >
                {taxes?.map((tax) => (
                  <MenuItem key={tax.taxid} value={tax.taxid}>
                    {tax.taxname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Inspector</InputLabel>
              <Select
                value={formData.inspectorid || ''}
                label="Inspector"
                onChange={(e) => setFormData({ ...formData, inspectorid: Number(e.target.value) })}
                required
              >
                {inspectors?.map((inspector) => (
                  <MenuItem key={inspector.inspectorid} value={inspector.inspectorid}>
                    {`${inspector.firstname} ${inspector.lastname}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedViolation ? 'Update' : 'Create'}
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

export default Violations; 