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

interface Department {
  departmentid: number;
  name: string;
  address: string;
  phone: string;
  headinspectorid: number | null;
}

const Departments: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState<Partial<Department>>({});
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const queryClient = useQueryClient();

  const { data: departments, isLoading } = useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: async () => {
      const response = await api.get(endpoints.departments);
      return response.data;
    },
  });

  const createMutation = useMutation<Department, Error, Omit<Department, 'departmentid'>>({
    mutationFn: async (newDepartment) => {
      const response = await api.post(endpoints.departments, newDepartment);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      handleClose();
    },
    onError: () => {
      setError('Не удалось создать отдел');
    },
  });

  const updateMutation = useMutation<Department, Error, Department>({
    mutationFn: async (updatedDepartment) => {
      const response = await api.put(
        `${endpoints.departments}/${updatedDepartment.departmentid}`,
        updatedDepartment
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      handleClose();
    },
    onError: () => {
      setError('Не удалось обновить отдел');
    },
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await api.delete(`${endpoints.departments}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
    onError: () => {
      setError('Не удалось удалить отдел');
    },
  });

  const handleOpen = (department?: Department) => {
    if (department) {
      setSelectedDepartment(department);
      setFormData(department);
    } else {
      setSelectedDepartment(null);
      setFormData({});
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDepartment(null);
    setFormData({});
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDepartment) {
      updateMutation.mutate({ ...selectedDepartment, ...formData });
    } else {
      createMutation.mutate(formData as Omit<Department, 'departmentid'>);
    }
  };

  const columns: GridColDef[] = [
    { field: 'departmentid', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Название', width: 200 },
    { field: 'address', headerName: 'Адрес', width: 200 },
    { field: 'phone', headerName: 'Телефон', width: 130 },
    { field: 'headinspectorid', headerName: 'ID руководителя', width: 130 },
    {
      field: 'actions',
      headerName: 'Действия',
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
            Изменить
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => deleteMutation.mutate(params.row.departmentid)}
          >
            Удалить
          </Button>
        </Box>
      ),
    },
  ];

  const filterFields = [
    { field: 'name', label: 'Название' },
    { field: 'address', label: 'Адрес' },
    { field: 'phone', label: 'Телефон' },
    { field: 'headinspectorid', label: 'ID руководителя' },
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleFilterReset = () => {
    setFilters({});
  };

  const filteredDepartments = useMemo(() => {
    if (!departments) return [];
    
    return departments.filter(department => {
      return Object.entries(filters).every(([field, value]) => {
        if (!value) return true;
        const fieldValue = String(department[field as keyof Department]).toLowerCase();
        return fieldValue.includes(value.toLowerCase());
      });
    });
  }, [departments, filters]);

  return (
    <Box sx={{ height: 600, width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Отделы</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Добавить отдел
        </Button>
      </Box>

      <Filter
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleFilterReset}
        filterFields={filterFields}
      />

      <DataGrid
        rows={filteredDepartments}
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
        getRowId={(row) => row.departmentid}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedDepartment ? 'Редактировать отдел' : 'Добавить отдел'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Название"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Адрес"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Телефон"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="ID руководителя"
              type="number"
              value={formData.headinspectorid || ''}
              onChange={(e) => setFormData({ ...formData, headinspectorid: parseInt(e.target.value) || null })}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedDepartment ? 'Обновить' : 'Создать'}
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

export default Departments; 