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
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
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
      setError('Не удалось создать штраф');
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
      setError('Не удалось обновить штраф');
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
      setError('Не удалось удалить штраф');
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
    { field: 'fineamount', headerName: 'Сумма', width: 130 },
    { field: 'chargedate', headerName: 'Дата начисления', width: 130 },
    { field: 'paymentdeadline', headerName: 'Срок оплаты', width: 130 },
    { field: 'paymentstatus', headerName: 'Статус оплаты', width: 130 },
    { field: 'paymentdate', headerName: 'Дата оплаты', width: 130 },
    { field: 'violationid', headerName: 'ID нарушения', width: 130 },
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
            onClick={() => deleteMutation.mutate(params.row.fineid)}
          >
            Удалить
          </Button>
        </Box>
      ),
    },
  ];

  const filterFields = [
    { field: 'fineamount', label: 'Сумма' },
    { field: 'paymentstatus', label: 'Статус оплаты' },
    { field: 'chargedate', label: 'Дата начисления' },
    { field: 'paymentdeadline', label: 'Срок оплаты' },
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleFilterReset = () => {
    setFilters({});
  };

  const filteredFines = useMemo(() => {
    if (!fines) return [];
    
    return fines.filter(fine => {
      return Object.entries(filters).every(([field, value]) => {
        if (!value) return true;
        const fieldValue = String(fine[field as keyof Fine]).toLowerCase();
        return fieldValue.includes(value.toLowerCase());
      });
    });
  }, [fines, filters]);

  return (
    <Box sx={{ height: 600, width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Штрафы</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Добавить штраф
        </Button>
      </Box>

      <Filter
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleFilterReset}
        filterFields={filterFields}
      />

      <DataGrid
        rows={filteredFines}
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
          {selectedFine ? 'Редактировать штраф' : 'Добавить штраф'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Сумма штрафа"
              type="number"
              value={formData.fineamount || ''}
              onChange={(e) => setFormData({ ...formData, fineamount: parseFloat(e.target.value) })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Дата начисления"
              type="date"
              value={formData.chargedate || ''}
              onChange={(e) => setFormData({ ...formData, chargedate: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Срок оплаты"
              type="date"
              value={formData.paymentdeadline || ''}
              onChange={(e) => setFormData({ ...formData, paymentdeadline: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Статус оплаты"
              value={formData.paymentstatus || ''}
              onChange={(e) => setFormData({ ...formData, paymentstatus: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Дата оплаты"
              type="date"
              value={formData.paymentdate || ''}
              onChange={(e) => setFormData({ ...formData, paymentdate: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="ID нарушения"
              type="number"
              value={formData.violationid || ''}
              onChange={(e) => setFormData({ ...formData, violationid: Number(e.target.value) })}
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedFine ? 'Обновить' : 'Создать'}
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