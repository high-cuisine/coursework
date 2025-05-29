import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import api, { endpoints } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
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

interface Fine {
  fineid: number;
  fineamount: number;
  chargedate: string;
  paymentdeadline: string;
  paymentstatus: string;
  paymentdate: string | null;
  violationid: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const TaxpayerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [violationFilters, setViolationFilters] = useState<{ [key: string]: string }>({});
  const [fineFilters, setFineFilters] = useState<{ [key: string]: string }>({});

  const { data: violations, isLoading: isLoadingViolations } = useQuery<Violation[]>({
    queryKey: ['violations'],
    queryFn: async () => {
      const response = await api.get(endpoints.violations);
      return response.data;
    },
  });

  const { data: fines, isLoading: isLoadingFines } = useQuery<Fine[]>({
    queryKey: ['fines'],
    queryFn: async () => {
      const response = await api.get(endpoints.fines);
      return response.data;
    },
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const violationColumns: GridColDef[] = [
    { field: 'violationdate', headerName: 'Дата', width: 130 },
    { field: 'violationperiod', headerName: 'Период', width: 130 },
    { field: 'nonpaymentamount', headerName: 'Сумма', width: 130 },
    { field: 'violationdescription', headerName: 'Описание', width: 200 },
    { field: 'status', headerName: 'Статус', width: 130 },
    { field: 'paymentoverdue', headerName: 'Просрочено', width: 100, type: 'boolean' },
  ];

  const fineColumns: GridColDef[] = [
    { field: 'fineamount', headerName: 'Сумма', width: 130 },
    { field: 'chargedate', headerName: 'Дата начисления', width: 130 },
    { field: 'paymentdeadline', headerName: 'Срок оплаты', width: 130 },
    { field: 'paymentstatus', headerName: 'Статус оплаты', width: 130 },
    { field: 'paymentdate', headerName: 'Дата оплаты', width: 130 },
  ];

  const violationFilterFields = [
    { field: 'status', label: 'Статус' },
    { field: 'violationperiod', label: 'Период' },
  ];

  const fineFilterFields = [
    { field: 'paymentstatus', label: 'Статус оплаты' },
    { field: 'chargedate', label: 'Дата начисления' },
  ];

  const filteredViolations = useMemo(() => {
    if (!violations || !user) return [];
    
    return violations
      .filter(violation => violation.taxpayerid === user.id)
      .filter(violation => {
        return Object.entries(violationFilters).every(([field, value]) => {
          if (!value) return true;
          const fieldValue = String(violation[field as keyof Violation]).toLowerCase();
          return fieldValue.includes(value.toLowerCase());
        });
      });
  }, [violations, violationFilters, user]);

  const filteredFines = useMemo(() => {
    if (!fines || !user) return [];
    
    const userViolations = violations?.filter(v => v.taxpayerid === user.id) || [];
    const userViolationIds = new Set(userViolations.map(v => v.violationid));
    
    return fines
      .filter(fine => userViolationIds.has(fine.violationid))
      .filter(fine => {
        return Object.entries(fineFilters).every(([field, value]) => {
          if (!value) return true;
          const fieldValue = String(fine[field as keyof Fine]).toLowerCase();
          return fieldValue.includes(value.toLowerCase());
        });
      });
  }, [fines, fineFilters, violations, user]);

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Панель налогоплательщика
      </Typography>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Нарушения" />
          <Tab label="Штрафы" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Filter
            filters={violationFilters}
            onFilterChange={(field, value) => setViolationFilters(prev => ({ ...prev, [field]: value }))}
            onReset={() => setViolationFilters({})}
            filterFields={violationFilterFields}
          />
          <DataGrid
            rows={filteredViolations}
            columns={violationColumns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
            loading={isLoadingViolations}
            getRowId={(row) => row.violationid}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Filter
            filters={fineFilters}
            onFilterChange={(field, value) => setFineFilters(prev => ({ ...prev, [field]: value }))}
            onReset={() => setFineFilters({})}
            filterFields={fineFilterFields}
          />
          <DataGrid
            rows={filteredFines}
            columns={fineColumns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
            loading={isLoadingFines}
            getRowId={(row) => row.fineid}
          />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default TaxpayerDashboard; 