import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import axios from 'axios';
import { Sale, Store } from '../types';

interface ReportData {
  total_sales: number;
  total_revenue: number;
  top_products: {
    ProductName: string;
    Quantity: number;
    TotalAmount: number;
  }[];
  recent_sales: Sale[];
}

const Reports: React.FC = () => {
  const [report, setReport] = useState<ReportData | null>(null);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const response = await axios.get('http://localhost:3001/reports');
      setReport(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!report) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Загрузка отчета...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Отчеты
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Общее количество продаж
              </Typography>
              <Typography variant="h4">{report.total_sales}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Общая выручка
              </Typography>
              <Typography variant="h4">{report.total_revenue} ₽</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Популярные товары
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Товар</TableCell>
                    <TableCell align="right">Количество</TableCell>
                    <TableCell align="right">Выручка</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report.top_products.map((product) => (
                    <TableRow key={product.ProductName}>
                      <TableCell>{product.ProductName}</TableCell>
                      <TableCell align="right">{product.Quantity}</TableCell>
                      <TableCell align="right">{product.TotalAmount} ₽</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Последние продажи
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Магазин</TableCell>
                    <TableCell>Товар</TableCell>
                    <TableCell align="right">Количество</TableCell>
                    <TableCell align="right">Сумма</TableCell>
                    <TableCell align="right">Дата</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report.recent_sales.map((sale) => (
                    <TableRow key={sale.SaleID}>
                      <TableCell>{sale.Store?.StoreName}</TableCell>
                      <TableCell>{sale.Product?.ProductName}</TableCell>
                      <TableCell align="right">{sale.Quantity}</TableCell>
                      <TableCell align="right">{sale.TotalAmount} ₽</TableCell>
                      <TableCell align="right">{formatDate(sale.SaleDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Reports; 