import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { apiService } from '../services/api';
import { SalesReport, InventoryReport, ProfitReport } from '../types';

export default function Reports() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [salesReport, setSalesReport] = useState<SalesReport | null>(null);
  const [inventoryReport, setInventoryReport] = useState<InventoryReport | null>(null);
  const [profitReport, setProfitReport] = useState<ProfitReport | null>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'startDate') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  const loadSalesReport = async () => {
    try {
      const data = await apiService.getSalesReport(startDate, endDate);
      setSalesReport(data);
    } catch (error) {
      console.error('Failed to load sales report:', error);
    }
  };

  const loadInventoryReport = async () => {
    try {
      const data = await apiService.getInventoryReport();
      setInventoryReport(data);
    } catch (error) {
      console.error('Failed to load inventory report:', error);
    }
  };

  const loadProfitReport = async () => {
    try {
      const data = await apiService.getProfitReport(startDate, endDate);
      setProfitReport(data);
    } catch (error) {
      console.error('Failed to load profit report:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Reports
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Date Range
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                name="startDate"
                label="Start Date"
                type="date"
                value={startDate}
                onChange={handleDateChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="endDate"
                label="End Date"
                type="date"
                value={endDate}
                onChange={handleDateChange}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={loadSalesReport}
                disabled={!startDate || !endDate}
              >
                Load Sales Report
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={loadInventoryReport}
              >
                Load Inventory Report
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={loadProfitReport}
                disabled={!startDate || !endDate}
              >
                Load Profit Report
              </Button>
            </Box>
          </Paper>
        </Box>

        {salesReport && (
          <Box>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sales Report
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Total Sales: {salesReport.totalSales}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Total Revenue: ${salesReport.totalRevenue.toFixed(2)}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Sales by Product
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Revenue</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {salesReport.salesByProduct.map((item) => (
                        <TableRow key={item.productName}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">
                            ${item.revenue.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Sales by Store
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Store</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Revenue</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {salesReport.salesByStore.map((item) => (
                        <TableRow key={item.storeName}>
                          <TableCell>{item.storeName}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">
                            ${item.revenue.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Box>
        )}

        {inventoryReport && (
          <Box>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Inventory Report
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell align="right">Total Quantity</TableCell>
                        <TableCell>Store Distribution</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {inventoryReport.inventory.map((product) => (
                        <TableRow key={product.productId}>
                          <TableCell>{product.productname}</TableCell>
                          <TableCell>{product.storename}</TableCell>
                          <TableCell align="right">
                            {product.quantity}
                          </TableCell>
                          <TableCell>
                            {product?.stores && product.stores.map((store) => (
                              <Typography key={store.storeId} variant="body2">
                                {store.storeName}: {store.quantity}
                              </Typography>
                            ))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Box>
        )}

        {profitReport && (
          <Box>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Profit Report
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Total Profit: ${profitReport.totalProfit.toFixed(2)}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Profit by Product
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Profit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {profitReport.profitByProduct.map((item) => (
                        <TableRow key={item.productId}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell align="right">
                            ${item.profit.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Profit by Store
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Store</TableCell>
                        <TableCell align="right">Profit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {profitReport.profitByStore.map((item) => (
                        <TableRow key={item.storeId}>
                          <TableCell>{item.storeName}</TableCell>
                          <TableCell align="right">
                            ${item.profit.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </Container>
  );
} 