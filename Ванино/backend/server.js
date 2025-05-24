const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('./config/database');
const userQueries = require('./db/queries/users');
const bankQueries = require('./db/queries/bank');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));
app.use(express.json());

// Middleware для проверки JWT токена
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Требуется авторизация' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Недействительный токен' });
        }
        req.user = user;
        next();
    });
};

// Регистрация пользователя
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        
        const result = await query(userQueries.createUser, [
            username,
            passwordHash,
            email,
            'user'
        ]);
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Авторизация
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const result = await query(userQueries.getUserByUsername, [username]);
        const user = result.rows[0];
        
        if (!user) {
            return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
        }
        
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
        }
        
        const token = jwt.sign(
            { id: user.user_id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            token,
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Защищенные маршруты
app.use('/api/bank', authenticateToken);

// Маршруты для работы с филиалами
app.get('/api/bank/branches', async (req, res) => {
    try {
        const result = await query(bankQueries.getBranches);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/bank/branches', async (req, res) => {
    try {
        const { name } = req.body;
        const result = await query(bankQueries.createBranch, [name]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Маршруты для работы с организациями
app.get('/api/bank/organizations', async (req, res) => {
    try {
        const result = await query(bankQueries.getOrganizations);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/bank/organizations', async (req, res) => {
    try {
        const { name } = req.body;
        const result = await query(bankQueries.createOrganization, [name]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Маршруты для работы со счетами
app.get('/api/bank/accounts', async (req, res) => {
    try {
        const result = await query(bankQueries.getAccounts);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/bank/accounts', async (req, res) => {
    try {
        const { account_no, org_id } = req.body;
        const result = await query(bankQueries.createAccount, [account_no, org_id]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Маршруты для работы с платежами
app.get('/api/bank/payments', async (req, res) => {
    try {
        const result = await query(bankQueries.getPayments);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/bank/payments', async (req, res) => {
    try {
        const { pay_date, branch_id, purpose_id, payer_name, amount, org_rev_id } = req.body;
        const result = await query(bankQueries.createPayment, [
            pay_date,
            branch_id,
            purpose_id,
            payer_name,
            amount,
            org_rev_id
        ]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Маршруты для работы с версиями реквизитов организаций
app.get('/api/bank/organizations/:orgId/history', async (req, res) => {
    try {
        const { orgId } = req.params;
        const result = await query(bankQueries.getOrganizationHistory, [orgId]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/bank/organizations/:orgId/revisions', async (req, res) => {
    try {
        const { orgId } = req.params;
        const { name, inn, kpp, address, valid_from, valid_to } = req.body;
        const result = await query(bankQueries.createOrganizationRev, [
            orgId,
            name,
            inn,
            kpp,
            address,
            valid_from,
            valid_to
        ]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Маршруты для работы с назначениями платежей
app.get('/api/bank/purposes', async (req, res) => {
    try {
        const result = await query(bankQueries.getPurposes);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/bank/purposes', async (req, res) => {
    try {
        const { account_no, purpose_name } = req.body;
        const result = await query(bankQueries.createPurpose, [account_no, purpose_name]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Расширенные маршруты для работы с платежами
app.get('/api/bank/payments/search', async (req, res) => {
    try {
        const { start_date, end_date, payer_name, branch_id, org_id } = req.query;
        const result = await query(bankQueries.searchPayments, [
            start_date,
            end_date,
            payer_name,
            branch_id,
            org_id
        ]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/bank/payments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query(bankQueries.getPaymentById, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Платеж не найден' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(5005, (err) => {
    if(err) {
        console.log(err);
    }
    console.log(`Server is running on port ${PORT}`);
}); 