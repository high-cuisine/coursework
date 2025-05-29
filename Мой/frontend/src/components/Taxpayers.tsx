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
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
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
      setError('Не удалось создать налогоплательщика');
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
      setError('Не удалось обновить налогоплательщика');
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
      setError('Не удалось удалить налогоплательщика');
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
    { field: 'type', headerName: 'Тип', width: 130 },
    { field: 'fullname', headerName: 'Полное имя', width: 200 },
    { field: 'taxid', headerName: 'ИНН', width: 130 },
    { field: 'registrationaddress', headerName: 'Адрес', width: 200 },
    { field: 'phone', headerName: 'Телефон', width: 130 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'registrationdate', headerName: 'Дата регистрации', width: 130 },
    { field: 'departmentid', headerName: 'ID отдела', width: 130 },
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
            onClick={() => deleteMutation.mutate(params.row.taxpayerid)}
          >
            Удалить
          </Button>
        </Box>
      ),
    },
  ];

  const filterFields = [
    { field: 'fullname', label: 'Полное имя' },
    { field: 'taxid', label: 'ИНН' },
    { field: 'type', label: 'Тип' },
    { field: 'email', label: 'Email' },
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleFilterReset = () => {
    setFilters({});
  };

  const filteredTaxpayers = useMemo(() => {
    if (!taxpayers) return [];
    
    return taxpayers.filter(taxpayer => {
      return Object.entries(filters).every(([field, value]) => {
        if (!value) return true;
        const fieldValue = String(taxpayer[field as keyof Taxpayer]).toLowerCase();
        return fieldValue.includes(value.toLowerCase());
      });
    });
  }, [taxpayers, filters]);

  return (
    <Box sx={{ height: 600, width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Налогоплательщики</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Добавить налогоплательщика
        </Button>
      </Box>

      <Filter
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleFilterReset}
        filterFields={filterFields}
      />

      <DataGrid
        rows={filteredTaxpayers}
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
          {selectedTaxpayer ? 'Редактировать налогоплательщика' : 'Добавить налогоплательщика'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>Тип</InputLabel>
              <Select
                value={formData.type || ''}
                label="Тип"
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <MenuItem value="individual">Физическое лицо</MenuItem>
                <MenuItem value="company">Компания</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Полное имя"
              value={formData.fullname || ''}
              onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="ИНН"
              value={formData.taxid || ''}
              onChange={(e) => setFormData({ ...formData, taxid: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Адрес"
              value={formData.registrationaddress || ''}
              onChange={(e) => setFormData({ ...formData, registrationaddress: e.target.value })}
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
              label="Email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Дата регистрации"
              type="date"
              value={formData.registrationdate || ''}
              onChange={(e) => setFormData({ ...formData, registrationdate: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Отдел</InputLabel>
              <Select
                value={formData.departmentid || ''}
                label="Отдел"
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
            <Button onClick={handleClose}>Отмена</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedTaxpayer ? 'Обновить' : 'Создать'}
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