import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    IconButton,
    Select,
    FormControl,
    InputLabel,
    Tab,
    Tabs
} from '@mui/material';
import { Add as AddIcon, History as HistoryIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Настройка axios
axios.defaults.baseURL = 'http://localhost:5005';
axios.defaults.withCredentials = true;

interface Branch {
    id: number;
    name: string;
    address: string;
}

interface Organization {
    id: number;
    name: string;
    inn: string;
    kpp: string;
    address: string;
}

interface OrganizationRev {
    id: number;
    org_id: number;
    name: string;
    inn: string;
    kpp: string;
    address: string;
    valid_from: string;
    valid_to: string;
}

interface Account {
    id: number;
    account_no: string;
    org_id: number;
    org_name: string;
}

interface Purpose {
    id: number;
    account_no: string;
    purpose_name: string;
}

interface Payment {
    id: number;
    payment_date: string;
    amount: number;
    payer_name: string;
    payer_account: string;
    payer_bank: string;
    payer_bik: string;
    payer_inn: string;
    payer_kpp: string;
    recipient_name: string;
    recipient_account: string;
    recipient_bank: string;
    recipient_bik: string;
    recipient_inn: string;
    recipient_kpp: string;
    purpose: string;
    branch_id: number;
    branch_name: string;
    org_id: number;
    org_name: string;
}

const Dashboard: React.FC = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [purposes, setPurposes] = useState<Purpose[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<'branch' | 'organization' | 'account' | 'payment' | 'purpose'>('branch');
    const [selectedOrg, setSelectedOrg] = useState<number | null>(null);
    const [orgHistory, setOrgHistory] = useState<OrganizationRev[]>([]);
    const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
    const [currentTab, setCurrentTab] = useState(0);

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        inn: '',
        kpp: '',
        account_no: '',
        org_id: '',
        payment_date: '',
        amount: '',
        payer_name: '',
        payer_account: '',
        payer_bank: '',
        payer_bik: '',
        payer_inn: '',
        payer_kpp: '',
        recipient_name: '',
        recipient_account: '',
        recipient_bank: '',
        recipient_bik: '',
        recipient_inn: '',
        recipient_kpp: '',
        purpose: '',
        branch_id: '',
        purpose_name: '',
        valid_from: '',
        valid_to: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const authHeaders = { Authorization: `Bearer ${token}` };

            const [branchesRes, orgsRes, accountsRes, purposesRes, paymentsRes] = await Promise.all([
                axios.get('/api/bank/branches', { headers: authHeaders }),
                axios.get('/api/bank/organizations', { headers: authHeaders }),
                axios.get('/api/bank/accounts', { headers: authHeaders }),
                axios.get('/api/bank/purposes', { headers: authHeaders }),
                axios.get('/api/bank/payments', { headers: authHeaders })
            ]);

            setBranches(branchesRes.data);
            setOrganizations(orgsRes.data);
            setAccounts(accountsRes.data);
            setPurposes(purposesRes.data);
            setPayments(paymentsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleOpenDialog = (type: 'branch' | 'organization' | 'account' | 'payment' | 'purpose') => {
        setDialogType(type);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({
            name: '',
            address: '',
            inn: '',
            kpp: '',
            account_no: '',
            org_id: '',
            payment_date: '',
            amount: '',
            payer_name: '',
            payer_account: '',
            payer_bank: '',
            payer_bik: '',
            payer_inn: '',
            payer_kpp: '',
            recipient_name: '',
            recipient_account: '',
            recipient_bank: '',
            recipient_bik: '',
            recipient_inn: '',
            recipient_kpp: '',
            purpose: '',
            branch_id: '',
            purpose_name: '',
            valid_from: '',
            valid_to: ''
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name as string]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const authHeaders = { Authorization: `Bearer ${token}` };

            switch (dialogType) {
                case 'branch':
                    await axios.post('/api/bank/branches', {
                        name: formData.name,
                        address: formData.address
                    }, { headers: authHeaders });
                    break;
                case 'organization':
                    await axios.post('/api/bank/organizations', {
                        name: formData.name,
                        inn: formData.inn,
                        kpp: formData.kpp,
                        address: formData.address
                    }, { headers: authHeaders });
                    break;
                case 'account':
                    await axios.post('/api/bank/accounts', {
                        account_no: formData.account_no,
                        org_id: formData.org_id
                    }, { headers: authHeaders });
                    break;
                case 'payment':
                    await axios.post('/api/bank/payments', {
                        payment_date: formData.payment_date,
                        amount: formData.amount,
                        payer_name: formData.payer_name,
                        payer_account: formData.payer_account,
                        payer_bank: formData.payer_bank,
                        payer_bik: formData.payer_bik,
                        payer_inn: formData.payer_inn,
                        payer_kpp: formData.payer_kpp,
                        recipient_name: formData.recipient_name,
                        recipient_account: formData.recipient_account,
                        recipient_bank: formData.recipient_bank,
                        recipient_bik: formData.recipient_bik,
                        recipient_inn: formData.recipient_inn,
                        recipient_kpp: formData.recipient_kpp,
                        purpose: formData.purpose,
                        branch_id: formData.branch_id
                    }, { headers: authHeaders });
                    break;
                case 'purpose':
                    await axios.post('/api/bank/purposes', {
                        account_no: formData.account_no,
                        purpose_name: formData.purpose_name
                    }, { headers: authHeaders });
                    break;
            }
            handleCloseDialog();
            fetchData();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleViewHistory = async (orgId: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const authHeaders = { Authorization: `Bearer ${token}` };
            
            const response = await axios.get(`/api/bank/organizations/${orgId}/history`, { headers: authHeaders });
            setOrgHistory(response.data);
            setSelectedOrg(orgId);
            setHistoryDialogOpen(true);
        } catch (error) {
            console.error('Error fetching organization history:', error);
        }
    };

    const handleAddRevision = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrg) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const authHeaders = { Authorization: `Bearer ${token}` };

            await axios.post(`/api/bank/organizations/${selectedOrg}/revisions`, {
                name: formData.name,
                inn: formData.inn,
                kpp: formData.kpp,
                address: formData.address,
                valid_from: formData.valid_from,
                valid_to: formData.valid_to
            }, { headers: authHeaders });
            handleCloseDialog();
            fetchData();
        } catch (error) {
            console.error('Error adding revision:', error);
        }
    };

    const renderDialogContent = () => {
        switch (dialogType) {
            case 'branch':
                return (
                    <>
                        <TextField
                            name="name"
                            label="Название филиала"
                            fullWidth
                            margin="normal"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        <TextField
                            name="address"
                            label="Адрес"
                            fullWidth
                            margin="normal"
                            value={formData.address}
                            onChange={handleInputChange}
                        />
                    </>
                );
            case 'organization':
                return (
                    <>
                        <TextField
                            name="name"
                            label="Название организации"
                            fullWidth
                            margin="normal"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        <TextField
                            name="inn"
                            label="ИНН"
                            fullWidth
                            margin="normal"
                            value={formData.inn}
                            onChange={handleInputChange}
                        />
                        <TextField
                            name="kpp"
                            label="КПП"
                            fullWidth
                            margin="normal"
                            value={formData.kpp}
                            onChange={handleInputChange}
                        />
                        <TextField
                            name="address"
                            label="Адрес"
                            fullWidth
                            margin="normal"
                            value={formData.address}
                            onChange={handleInputChange}
                        />
                    </>
                );
            case 'account':
                return (
                    <>
                        <TextField
                            name="account_no"
                            label="Номер счета"
                            fullWidth
                            margin="normal"
                            value={formData.account_no}
                            onChange={handleInputChange}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Организация</InputLabel>
                            <Select
                                name="org_id"
                                value={formData.org_id}
                                onChange={handleInputChange}
                            >
                                {organizations.map(org => (
                                    <MenuItem key={org.id} value={org.id}>
                                        {org.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </>
                );
            case 'payment':
                return (
                    <>
                        <TextField
                            name="payment_date"
                            label="Дата платежа"
                            type="date"
                            fullWidth
                            margin="normal"
                            value={formData.payment_date}
                            onChange={handleInputChange}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            name="amount"
                            label="Сумма"
                            type="number"
                            fullWidth
                            margin="normal"
                            value={formData.amount}
                            onChange={handleInputChange}
                        />
                        <TextField
                            name="payer_name"
                            label="Плательщик"
                            fullWidth
                            margin="normal"
                            value={formData.payer_name}
                            onChange={handleInputChange}
                        />
                        <TextField
                            name="payer_account"
                            label="Счет плательщика"
                            fullWidth
                            margin="normal"
                            value={formData.payer_account}
                            onChange={handleInputChange}
                        />
                        <TextField
                            name="payer_bank"
                            label="Банк плательщика"
                            fullWidth
                            margin="normal"
                            value={formData.payer_bank}
                            onChange={handleInputChange}
                        />
                        <TextField
                            name="payer_bik"
                            label="БИК плательщика"
                            fullWidth
                            margin="normal"
                            value={formData.payer_bik}
                            onChange={handleInputChange}
                        />
                        <TextField
                            name="payer_inn"
                            label="ИНН плательщика"
                            fullWidth
                            margin="normal"
                            value={formData.payer_inn}
                            onChange={handleInputChange}
                        />
                        <TextField
                            name="payer_kpp"
                            label="КПП плательщика"
                            fullWidth
                            margin="normal"
                            value={formData.payer_kpp}
                            onChange={handleInputChange}
                        />
                        <TextField
                            name="recipient_name"
                            label="Получатель"
                            fullWidth
                            margin="normal"
                            value={formData.recipient_name}
                            onChange={handleInputChange}
                        />
                        <TextField
                            name="recipient_account"
                            label="Счет получателя"
                            fullWidth
                            margin="normal"
                            value={formData.recipient_account}
                            onChange={handleInputChange}
                        />
                        <TextField
                            name="recipient_bank"
                            label="Банк получателя"
                            fullWidth
                            margin="normal"
                            value={formData.recipient_bank}
                            onChange={handleInputChange}
                        />
                        <TextField
                            name="recipient_bik"
                            label="БИК получателя"
                            fullWidth
                            margin="normal"
                            value={formData.recipient_bik}
                            onChange={handleInputChange}
                        />
                        <TextField
                            name="recipient_inn"
                            label="ИНН получателя"
                            fullWidth
                            margin="normal"
                            value={formData.recipient_inn}
                            onChange={handleInputChange}
                        />
                        <TextField
                            name="recipient_kpp"
                            label="КПП получателя"
                            fullWidth
                            margin="normal"
                            value={formData.recipient_kpp}
                            onChange={handleInputChange}
                        />
                        <TextField
                            name="purpose"
                            label="Назначение платежа"
                            fullWidth
                            margin="normal"
                            value={formData.purpose}
                            onChange={handleInputChange}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Филиал</InputLabel>
                            <Select
                                name="branch_id"
                                value={formData.branch_id}
                                onChange={handleInputChange}
                            >
                                {branches.map(branch => (
                                    <MenuItem key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </>
                );
            case 'purpose':
                return (
                    <>
                        <TextField
                            name="account_no"
                            label="Номер счета"
                            fullWidth
                            margin="normal"
                            value={formData.account_no}
                            onChange={handleInputChange}
                        />
                        <TextField
                            name="purpose_name"
                            label="Назначение платежа"
                            fullWidth
                            margin="normal"
                            value={formData.purpose_name}
                            onChange={handleInputChange}
                        />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
                    <Tab label="Филиалы" />
                    <Tab label="Организации" />
                    <Tab label="Счета" />
                    <Tab label="Назначения платежей" />
                    <Tab label="Платежи" />
                </Tabs>
            </Box>

            {currentTab === 0 && (
                <Box sx={{ width: '100%' }}>
                    <Paper sx={{ p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">Филиалы</Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenDialog('branch')}
                            >
                                Добавить филиал
                            </Button>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Название</TableCell>
                                        <TableCell>Адрес</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {branches.map(branch => (
                                        <TableRow key={branch.id}>
                                            <TableCell>{branch.id}</TableCell>
                                            <TableCell>{branch.name}</TableCell>
                                            <TableCell>{branch.address}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
            )}

            {currentTab === 1 && (
                <Box sx={{ width: '100%' }}>
                    <Paper sx={{ p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">Организации</Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenDialog('organization')}
                            >
                                Добавить организацию
                            </Button>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Название</TableCell>
                                        <TableCell>ИНН</TableCell>
                                        <TableCell>КПП</TableCell>
                                        <TableCell>Адрес</TableCell>
                                        <TableCell>Действия</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {organizations.map(org => (
                                        <TableRow key={org.id}>
                                            <TableCell>{org.id}</TableCell>
                                            <TableCell>{org.name}</TableCell>
                                            <TableCell>{org.inn}</TableCell>
                                            <TableCell>{org.kpp}</TableCell>
                                            <TableCell>{org.address}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    onClick={() => handleViewHistory(org.id)}
                                                    title="История изменений"
                                                >
                                                    <HistoryIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
            )}

            {currentTab === 2 && (
                <Box sx={{ width: '100%' }}>
                    <Paper sx={{ p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">Счета</Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenDialog('account')}
                            >
                                Добавить счет
                            </Button>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Номер счета</TableCell>
                                        <TableCell>Организация</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {accounts.map(account => (
                                        <TableRow key={account.id}>
                                            <TableCell>{account.id}</TableCell>
                                            <TableCell>{account.account_no}</TableCell>
                                            <TableCell>{account.org_name}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
            )}

            {currentTab === 3 && (
                <Box sx={{ width: '100%' }}>
                    <Paper sx={{ p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">Назначения платежей</Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenDialog('purpose')}
                            >
                                Добавить назначение
                            </Button>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Номер счета</TableCell>
                                        <TableCell>Назначение платежа</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {purposes.map(purpose => (
                                        <TableRow key={purpose.id}>
                                            <TableCell>{purpose.id}</TableCell>
                                            <TableCell>{purpose.account_no}</TableCell>
                                            <TableCell>{purpose.purpose_name}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
            )}

            {currentTab === 4 && (
                <Box sx={{ width: '100%' }}>
                    <Paper sx={{ p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">Платежи</Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenDialog('payment')}
                            >
                                Добавить платеж
                            </Button>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Дата</TableCell>
                                        <TableCell>Сумма</TableCell>
                                        <TableCell>Плательщик</TableCell>
                                        <TableCell>Получатель</TableCell>
                                        <TableCell>Назначение</TableCell>
                                        <TableCell>Филиал</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {payments.map(payment => (
                                        <TableRow key={payment.id}>
                                            <TableCell>{payment.id}</TableCell>
                                            <TableCell>{payment.payment_date}</TableCell>
                                            <TableCell>{payment.amount}</TableCell>
                                            <TableCell>{payment.payer_name}</TableCell>
                                            <TableCell>{payment.recipient_name}</TableCell>
                                            <TableCell>{payment.purpose}</TableCell>
                                            <TableCell>{payment.branch_name}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {dialogType === 'branch' && 'Добавить филиал'}
                    {dialogType === 'organization' && 'Добавить организацию'}
                    {dialogType === 'account' && 'Добавить счет'}
                    {dialogType === 'payment' && 'Добавить платеж'}
                    {dialogType === 'purpose' && 'Добавить назначение платежа'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        {renderDialogContent()}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Отмена</Button>
                        <Button type="submit" variant="contained">Сохранить</Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog open={historyDialogOpen} onClose={() => setHistoryDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>История изменений организации</DialogTitle>
                <DialogContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Дата начала</TableCell>
                                    <TableCell>Дата окончания</TableCell>
                                    <TableCell>Название</TableCell>
                                    <TableCell>ИНН</TableCell>
                                    <TableCell>КПП</TableCell>
                                    <TableCell>Адрес</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orgHistory.map(rev => (
                                    <TableRow key={rev.id}>
                                        <TableCell>{rev.valid_from}</TableCell>
                                        <TableCell>{rev.valid_to}</TableCell>
                                        <TableCell>{rev.name}</TableCell>
                                        <TableCell>{rev.inn}</TableCell>
                                        <TableCell>{rev.kpp}</TableCell>
                                        <TableCell>{rev.address}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setHistoryDialogOpen(false)}>Закрыть</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Dashboard; 