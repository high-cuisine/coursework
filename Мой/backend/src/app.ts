import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TaxpayerController } from './controllers/taxpayer.controller';
import { InspectorController } from './controllers/inspector.controller';
import { ViolationController } from './controllers/violation.controller';
import { requestLogger } from './middleware/logger';

const app = express();
const port = 3000;
const JWT_SECRET = 'your-secret-key'; // В продакшене используйте переменные окружения

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger); // Добавляем middleware для логирования

// Database connection
const pool = new Pool({
  user: process.env.user || 'postgres',
  host: process.env.host || 'localhost',
  database: process.env.database || 'tax_system',
  password: process.env.password || 'qwerty',
  port: +process.env.port || 5432,
});

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('Authentication failed: No token provided');
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      console.log('Authentication failed: Invalid token');
      return res.status(403).json({ error: 'Invalid token' });
    }
    console.log('Authentication successful:', { id: user.id, email: user.email, role: user.role });
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log('Attempting to register user:', { name, email, role });

    // Check if user already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      console.log(`Registration failed: User with email ${email} already exists`);
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, role]
    );

    // Generate token
    const token = jwt.sign(
      { id: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('User registered successfully:', { id: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role });
    res.json({ user: result.rows[0], token });
  } catch (err) {
    console.error('Error in POST /api/auth/register:', err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Attempting to login user:', { email });

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      console.log(`Login failed: User with email ${email} not found`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log(`Login failed: Invalid password for user ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('User logged in successfully:', { id: user.id, email: user.email, role: user.role });
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    console.error('Error in POST /api/auth/login:', err);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Protected routes
app.use('/api/taxpayers', authenticateToken);
app.use('/api/inspectors', authenticateToken);
app.use('/api/violations', authenticateToken);
app.use('/api/departments', authenticateToken);
app.use('/api/taxes', authenticateToken);
app.use('/api/fines', authenticateToken);
app.use('/api/properties', authenticateToken);

const taxpayerController = new TaxpayerController();
const inspectorController = new InspectorController();
const violationController = new ViolationController();

// Taxpayer routes
app.get('/api/taxpayers', (req, res) => taxpayerController.getAllTaxpayers(req, res));
app.get('/api/taxpayers/:id', (req, res) => taxpayerController.getTaxpayerById(req, res));
app.post('/api/taxpayers', (req, res) => taxpayerController.createTaxpayer(req, res));
app.put('/api/taxpayers/:id', (req, res) => taxpayerController.updateTaxpayer(req, res));
app.delete('/api/taxpayers/:id', (req, res) => taxpayerController.deleteTaxpayer(req, res));
app.get('/api/taxpayers/:id/violations', (req, res) => taxpayerController.getTaxpayerViolations(req, res));
app.get('/api/taxpayers/:id/fines', (req, res) => taxpayerController.getTaxpayerFines(req, res));

// Inspector routes
app.get('/api/inspectors', (req, res) => inspectorController.getAllInspectors(req, res));
app.get('/api/inspectors/:id', (req, res) => inspectorController.getInspectorById(req, res));
app.post('/api/inspectors', (req, res) => inspectorController.createInspector(req, res));
app.put('/api/inspectors/:id', (req, res) => inspectorController.updateInspector(req, res));
app.delete('/api/inspectors/:id', (req, res) => inspectorController.deleteInspector(req, res));
app.get('/api/inspectors/:id/violations', (req, res) => inspectorController.getInspectorViolations(req, res));
app.get('/api/inspectors/:id/department', (req, res) => inspectorController.getInspectorDepartment(req, res));

// Violation routes
app.get('/api/violations', (req, res) => violationController.getAllViolations(req, res));
app.get('/api/violations/:id', (req, res) => violationController.getViolationById(req, res));
app.post('/api/violations', (req, res) => violationController.createViolation(req, res));
app.put('/api/violations/:id', (req, res) => violationController.updateViolation(req, res));
app.get('/api/violations/overdue', (req, res) => violationController.getOverdueViolations(req, res));
app.get('/api/violations/status/:status', (req, res) => violationController.getViolationsByStatus(req, res));

// Fine routes
app.post('/api/fines', (req, res) => violationController.createFine(req, res));
app.put('/api/fines/:id', (req, res) => violationController.updateFine(req, res));
app.get('/api/violations/:violationId/fines', (req, res) => violationController.getViolationFines(req, res));

// Departments endpoints
app.get('/api/departments', async (req, res) => {
  try {
    console.log('Getting all departments');
    const result = await pool.query('SELECT * FROM Department');
    console.log(`Found ${result.rows.length} departments`);
    res.json(result.rows);
  } catch (err) {
    console.error('Error in GET /api/departments:', err);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

app.get('/api/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Getting department with ID: ${id}`);
    const result = await pool.query('SELECT * FROM Department WHERE DepartmentID = $1', [id]);
    if (result.rows.length === 0) {
      console.log(`Department with ID ${id} not found`);
      res.status(404).json({ error: 'Department not found' });
    } else {
      console.log('Found department:', result.rows[0]);
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(`Error in GET /api/departments/${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to fetch department' });
  }
});

app.post('/api/departments', async (req, res) => {
  try {
    const { name, address, phone, headinspectorid } = req.body;
    console.log('Creating new department:', req.body);
    const result = await pool.query(
      'INSERT INTO Department (Name, Address, Phone, HeadInspectorID) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, address, phone, headinspectorid]
    );
    console.log('Created department:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error in POST /api/departments:', err);
    res.status(500).json({ error: 'Failed to create department' });
  }
});

app.put('/api/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone, headinspectorid } = req.body;
    console.log(`Updating department with ID: ${id}`, req.body);
    const result = await pool.query(
      'UPDATE Department SET Name = $1, Address = $2, Phone = $3, HeadInspectorID = $4 WHERE DepartmentID = $5 RETURNING *',
      [name, address, phone, headinspectorid, id]
    );
    if (result.rows.length === 0) {
      console.log(`Department with ID ${id} not found`);
      res.status(404).json({ error: 'Department not found' });
    } else {
      console.log('Updated department:', result.rows[0]);
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(`Error in PUT /api/departments/${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to update department' });
  }
});

app.delete('/api/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting department with ID: ${id}`);
    const result = await pool.query('DELETE FROM Department WHERE DepartmentID = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      console.log(`Department with ID ${id} not found`);
      res.status(404).json({ error: 'Department not found' });
    } else {
      console.log(`Successfully deleted department with ID: ${id}`);
      res.status(204).send();
    }
  } catch (err) {
    console.error(`Error in DELETE /api/departments/${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to delete department' });
  }
});

// Taxes endpoints
app.get('/api/taxes', async (req, res) => {
  try {
    console.log('Getting all taxes');
    const result = await pool.query('SELECT * FROM Tax');
    console.log(`Found ${result.rows.length} taxes`);
    res.json(result.rows);
  } catch (err) {
    console.error('Error in GET /api/taxes:', err);
    res.status(500).json({ error: 'Failed to fetch taxes' });
  }
});

app.get('/api/taxes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Getting tax with ID: ${id}`);
    const result = await pool.query('SELECT * FROM Tax WHERE TaxID = $1', [id]);
    if (result.rows.length === 0) {
      console.log(`Tax with ID ${id} not found`);
      res.status(404).json({ error: 'Tax not found' });
    } else {
      console.log('Found tax:', result.rows[0]);
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(`Error in GET /api/taxes/${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to fetch tax' });
  }
});

app.post('/api/taxes', async (req, res) => {
  try {
    const { taxcode, taxname, rate } = req.body;
    console.log('Creating new tax:', req.body);
    const result = await pool.query(
      'INSERT INTO Tax (TaxCode, TaxName, Rate) VALUES ($1, $2, $3) RETURNING *',
      [taxcode, taxname, rate]
    );
    console.log('Created tax:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error in POST /api/taxes:', err);
    res.status(500).json({ error: 'Failed to create tax' });
  }
});

app.put('/api/taxes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { taxcode, taxname, rate } = req.body;
    console.log(`Updating tax with ID: ${id}`, req.body);
    const result = await pool.query(
      'UPDATE Tax SET TaxCode = $1, TaxName = $2, Rate = $3 WHERE TaxID = $4 RETURNING *',
      [taxcode, taxname, rate, id]
    );
    if (result.rows.length === 0) {
      console.log(`Tax with ID ${id} not found`);
      res.status(404).json({ error: 'Tax not found' });
    } else {
      console.log('Updated tax:', result.rows[0]);
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(`Error in PUT /api/taxes/${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to update tax' });
  }
});

app.delete('/api/taxes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting tax with ID: ${id}`);
    const result = await pool.query('DELETE FROM Tax WHERE TaxID = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      console.log(`Tax with ID ${id} not found`);
      res.status(404).json({ error: 'Tax not found' });
    } else {
      console.log(`Successfully deleted tax with ID: ${id}`);
      res.status(204).send();
    }
  } catch (err) {
    console.error(`Error in DELETE /api/taxes/${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to delete tax' });
  }
});

// Fines endpoints
app.get('/api/fines', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Fine');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch fines' });
  }
});

app.get('/api/fines/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM Fine WHERE FineID = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Fine not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch fine' });
  }
});

app.post('/api/fines', async (req, res) => {
  try {
    const { fineamount, chargedate, paymentdeadline, paymentstatus, paymentdate, violationid } = req.body;
    const result = await pool.query(
      'INSERT INTO Fine (FineAmount, ChargeDate, PaymentDeadline, PaymentStatus, PaymentDate, ViolationID) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [fineamount, chargedate, paymentdeadline, paymentstatus, paymentdate, violationid]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create fine' });
  }
});

app.put('/api/fines/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fineamount, chargedate, paymentdeadline, paymentstatus, paymentdate, violationid } = req.body;
    const result = await pool.query(
      'UPDATE Fine SET FineAmount = $1, ChargeDate = $2, PaymentDeadline = $3, PaymentStatus = $4, PaymentDate = $5, ViolationID = $6 WHERE FineID = $7 RETURNING *',
      [fineamount, chargedate, paymentdeadline, paymentstatus, paymentdate, violationid, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Fine not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update fine' });
  }
});

app.delete('/api/fines/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM Fine WHERE FineID = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Fine not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete fine' });
  }
});

// Properties endpoints
app.get('/api/properties', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Property');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM Property WHERE PropertyID = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Property not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

app.post('/api/properties', async (req, res) => {
  try {
    const { propertytype, taxpayerid } = req.body;
    
    // Check if taxpayer exists
    const taxpayerCheck = await pool.query('SELECT * FROM Taxpayer WHERE TaxpayerID = $1', [taxpayerid]);
    if (taxpayerCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Taxpayer not found' });
    }

    const result = await pool.query(
      'INSERT INTO Property (PropertyType, TaxpayerID) VALUES ($1, $2) RETURNING *',
      [propertytype, taxpayerid]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create property' });
  }
});

app.put('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { propertytype, taxpayerid } = req.body;
    const result = await pool.query(
      'UPDATE Property SET PropertyType = $1, TaxpayerID = $2 WHERE PropertyID = $3 RETURNING *',
      [propertytype, taxpayerid, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Property not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update property' });
  }
});

app.delete('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM Property WHERE PropertyID = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Property not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 