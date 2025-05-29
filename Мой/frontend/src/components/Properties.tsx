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
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { endpoints } from '../utils/api';
import Filter from './Filter';

interface Property {
  propertyid: number;
  propertytype: string;
  taxpayerid: number;
}

const Properties: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<Partial<Property>>({});
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const queryClient = useQueryClient();

  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: async () => {
      const response = await api.get(endpoints.properties);
      return response.data;
    },
  });

  const createMutation = useMutation<Property, Error, Omit<Property, 'propertyid'>>({
    mutationFn: async (newProperty) => {
      const response = await api.post(endpoints.properties, newProperty);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      handleClose();
    },
    onError: () => {
      setError('Failed to create property');
    },
  });

  const updateMutation = useMutation<Property, Error, Property>({
    mutationFn: async (updatedProperty) => {
      const response = await api.put(
        `${endpoints.properties}/${updatedProperty.propertyid}`,
        updatedProperty
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      handleClose();
    },
    onError: () => {
      setError('Failed to update property');
    },
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await api.delete(`${endpoints.properties}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
    onError: () => {
      setError('Failed to delete property');
    },
  });

  const handleOpen = (property?: Property) => {
    if (property) {
      setSelectedProperty(property);
      setFormData(property);
    } else {
      setSelectedProperty(null);
      setFormData({});
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProperty(null);
    setFormData({});
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProperty) {
      updateMutation.mutate({ ...selectedProperty, ...formData });
    } else {
      createMutation.mutate(formData as Omit<Property, 'propertyid'>);
    }
  };

  const columns: GridColDef[] = [
    { field: 'propertyid', headerName: 'ID', width: 70 },
    { field: 'propertytype', headerName: 'Property Type', width: 200 },
    { field: 'taxpayerid', headerName: 'Taxpayer ID', width: 130 },
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
            onClick={() => deleteMutation.mutate(params.row.propertyid)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const filterFields = [
    { field: 'propertytype', label: 'Property Type' },
    { field: 'taxpayerid', label: 'Taxpayer ID' },
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleFilterReset = () => {
    setFilters({});
  };

  const filteredProperties = useMemo(() => {
    if (!properties) return [];
    
    return properties.filter(property => {
      return Object.entries(filters).every(([field, value]) => {
        if (!value) return true;
        const fieldValue = String(property[field as keyof Property]).toLowerCase();
        return fieldValue.includes(value.toLowerCase());
      });
    });
  }, [properties, filters]);

  return (
    <Box sx={{ height: 600, width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Properties</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add Property
        </Button>
      </Box>

      <Filter
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleFilterReset}
        filterFields={filterFields}
      />

      <DataGrid
        rows={filteredProperties}
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
        getRowId={(row) => row.propertyid}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedProperty ? 'Edit Property' : 'Add New Property'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Property Type"
              value={formData.propertytype || ''}
              onChange={(e) => setFormData({ ...formData, propertytype: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Taxpayer ID"
              type="number"
              value={formData.taxpayerid || ''}
              onChange={(e) => setFormData({ ...formData, taxpayerid: parseInt(e.target.value) })}
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedProperty ? 'Update' : 'Create'}
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

export default Properties; 