import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TaxpayerController } from './controllers/taxpayer.controller';
import { InspectorController } from './controllers/inspector.controller';
import { ViolationController } from './controllers/violation.controller';

const app = express();
const port = 3000;
const JWT_SECRET = 'your-secret-key'; // В продакшене используйте переменные окружения

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tax_system',
  password: 'qwerty',
  port: 5432,
});

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
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

    res.json({ user: result.rows[0], token });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

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
    const result = await pool.query('SELECT * FROM Department');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

app.get('/api/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM Department WHERE DepartmentID = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Department not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch department' });
  }
});

app.post('/api/departments', async (req, res) => {
  try {
    const { name, address, phone, headinspectorid } = req.body;
    const result = await pool.query(
      'INSERT INTO Department (Name, Address, Phone, HeadInspectorID) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, address, phone, headinspectorid]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create department' });
  }
});

app.put('/api/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone, headinspectorid } = req.body;
    const result = await pool.query(
      'UPDATE Department SET Name = $1, Address = $2, Phone = $3, HeadInspectorID = $4 WHERE DepartmentID = $5 RETURNING *',
      [name, address, phone, headinspectorid, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Department not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update department' });
  }
});

app.delete('/api/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM Department WHERE DepartmentID = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Department not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete department' });
  }
});

// Taxes endpoints
app.get('/api/taxes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Tax');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch taxes' });
  }
});

app.get('/api/taxes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM Tax WHERE TaxID = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Tax not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tax' });
  }
});

app.post('/api/taxes', async (req, res) => {
  try {
    const { taxcode, taxname, rate, regulatorydocument, description, taxtype } = req.body;
    const result = await pool.query(
      'INSERT INTO Tax (TaxCode, TaxName, Rate, RegulatoryDocument, Description, TaxType) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [taxcode, taxname, rate, regulatorydocument, description, taxtype]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create tax' });
  }
});

app.put('/api/taxes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { taxcode, taxname, rate, regulatorydocument, description, taxtype } = req.body;
    const result = await pool.query(
      'UPDATE Tax SET TaxCode = $1, TaxName = $2, Rate = $3, RegulatoryDocument = $4, Description = $5, TaxType = $6 WHERE TaxID = $7 RETURNING *',
      [taxcode, taxname, rate, regulatorydocument, description, taxtype, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Tax not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update tax' });
  }
});

app.delete('/api/taxes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM Tax WHERE TaxID = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Tax not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
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