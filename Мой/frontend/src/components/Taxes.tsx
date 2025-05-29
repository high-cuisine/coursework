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
      setError('Не удалось создать налог');
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
      setError('Не удалось обновить налог');
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
      setError('Не удалось удалить налог');
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
    { field: 'taxcode', headerName: 'Код налога', width: 130 },
    { field: 'taxname', headerName: 'Название налога', width: 200 },
    { field: 'rate', headerName: 'Ставка', width: 100 },
    { field: 'regulatorydocument', headerName: 'Нормативный документ', width: 200 },
    { field: 'description', headerName: 'Описание', width: 200 },
    { field: 'taxtype', headerName: 'Тип налога', width: 130 },
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
            onClick={() => deleteMutation.mutate(params.row.taxid)}
          >
            Удалить
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Налоги</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Добавить налог
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
          {selectedTax ? 'Редактировать налог' : 'Добавить налог'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Код налога"
              value={formData.taxcode || ''}
              onChange={(e) => setFormData({ ...formData, taxcode: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Название налога"
              value={formData.taxname || ''}
              onChange={(e) => setFormData({ ...formData, taxname: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Ставка"
              type="number"
              value={formData.rate || ''}
              onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Нормативный документ"
              value={formData.regulatorydocument || ''}
              onChange={(e) => setFormData({ ...formData, regulatorydocument: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Описание"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              label="Тип налога"
              value={formData.taxtype || ''}
              onChange={(e) => setFormData({ ...formData, taxtype: e.target.value })}
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedTax ? 'Обновить' : 'Создать'}
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