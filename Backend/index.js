// Import required packages
const express = require('express');                // Web framework for Node.js
const dotenv = require('dotenv');                  // Loads environment variables from .env file
dotenv.config();                                   // Initialize dotenv
const cors=require('cors');
const db = require('./db');                        // Import the database connection
const swaggerJsdoc = require('swagger-jsdoc');     // For generating Swagger docs
const swaggerUi = require('swagger-ui-express');   // For serving Swagger UI

const app = express();                             // Create an Express app
const port = process.env.PORT || 9000;             // Use port from .env or default to 9000

app.use(cors({ origin: '*' }));

app.use(express.json());                           // Middleware to parse JSON request bodies

// Swagger setup for API documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Stock Broking App API',
      version: '1.0.0',
      description: 'API for managing stock broking portfolio with instruments, goals, and trade logs',
    },
  },
  apis: ['./index.js'], // Where Swagger will look for documentation comments
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Serve docs at /api-docs

// Swagger documentation for the schemas
/**
 * @swagger
 * components:
 *   schemas:
 *     Instrument:
 *       type: object
 *       required:
 *         - symbol
 *         - name
 *         - type
 *         - current_price
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the instrument
 *         symbol:
 *           type: string
 *           description: Instrument symbol
 *         name:
 *           type: string
 *           description: Instrument name
 *         type:
 *           type: string
 *           enum: [STOCK, MF, GOLD]
 *           description: Type of instrument
 *         current_price:
 *           type: number
 *           format: float
 *           description: Current price of the instrument
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *       example:
 *         id: 1
 *         symbol: RELIANCE
 *         name: Reliance Industries Ltd
 *         type: STOCK
 *         current_price: 2450.50
 *         created_at: 2024-01-01T00:00:00.000Z
 *         updated_at: 2024-01-01T00:00:00.000Z
 *     
 *     Goal:
 *       type: object
 *       required:
 *         - name
 *         - target_amount
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the goal
 *         name:
 *           type: string
 *           description: Goal name
 *         target_amount:
 *           type: number
 *           format: float
 *           description: Target amount for the goal
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *       example:
 *         id: 1
 *         name: Retirement Fund
 *         target_amount: 5000000.00
 *         created_at: 2024-01-01T00:00:00.000Z
 *     
 *     TradeLog:
 *       type: object
 *       required:
 *         - instrument_id
 *         - transaction_type
 *         - quantity
 *         - price
 *         - total_amount
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the trade log
 *         instrument_id:
 *           type: integer
 *           description: ID of the instrument being traded
 *         goal_id:
 *           type: integer
 *           description: ID of the associated goal (optional)
 *         transaction_type:
 *           type: string
 *           enum: [BUY, SELL]
 *           description: Type of transaction
 *         quantity:
 *           type: number
 *           format: float
 *           description: Quantity traded
 *         price:
 *           type: number
 *           format: float
 *           description: Price per unit
 *         total_amount:
 *           type: number
 *           format: float
 *           description: Total transaction amount
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Transaction timestamp
 *       example:
 *         id: 1
 *         instrument_id: 1
 *         goal_id: 1
 *         transaction_type: BUY
 *         quantity: 10
 *         price: 2400.00
 *         total_amount: 24000.00
 *         created_at: 2024-01-01T00:00:00.000Z
 */

/**
 * @swagger
 * /instruments:
 *   get:
 *     summary: Get all instruments
 *     tags: [Instruments]
 *     responses:
 *       200:
 *         description: List of instruments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Instrument'
 *   post:
 *     summary: Add a new instrument
 *     tags: [Instruments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Instrument'
 *     responses:
 *       201:
 *         description: Instrument added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instrument'
 *
 * /instruments/{id}:
 *   get:
 *     summary: Get instrument by ID
 *     tags: [Instruments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The instrument id
 *     responses:
 *       200:
 *         description: Instrument details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instrument'
 *   put:
 *     summary: Update instrument
 *     tags: [Instruments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The instrument id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Instrument'
 *     responses:
 *       200:
 *         description: Instrument updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instrument'
 *   delete:
 *     summary: Delete instrument
 *     tags: [Instruments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The instrument id
 *     responses:
 *       200:
 *         description: Instrument deleted
 *
 * /goals:
 *   get:
 *     summary: Get all goals
 *     tags: [Goals]
 *     responses:
 *       200:
 *         description: List of goals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Goal'
 *   post:
 *     summary: Add a new goal
 *     tags: [Goals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Goal'
 *     responses:
 *       201:
 *         description: Goal added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Goal'
 *
 * /goals/{id}:
 *   get:
 *     summary: Get goal by ID
 *     tags: [Goals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The goal id
 *     responses:
 *       200:
 *         description: Goal details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Goal'
 *   put:
 *     summary: Update goal
 *     tags: [Goals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The goal id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Goal'
 *     responses:
 *       200:
 *         description: Goal updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Goal'
 *   delete:
 *     summary: Delete goal
 *     tags: [Goals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The goal id
 *     responses:
 *       200:
 *         description: Goal deleted
 *
 * /trade-log:
 *   get:
 *     summary: Get all trade logs
 *     tags: [Trade Log]
 *     responses:
 *       200:
 *         description: List of trade logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TradeLog'
 *
 * /instruments/{id}/buy:
 *   post:
 *     summary: Buy an instrument
 *     tags: [Trading]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The instrument id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *               - price
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: Quantity to buy
 *               price:
 *                 type: number
 *                 description: Price per unit
 *               goal_id:
 *                 type: integer
 *                 description: Optional goal ID to associate with this trade
 *     responses:
 *       201:
 *         description: Buy transaction completed and trade log created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TradeLog'
 *
 * /instruments/{id}/sell:
 *   post:
 *     summary: Sell an instrument
 *     tags: [Trading]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The instrument id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *               - price
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: Quantity to sell
 *               price:
 *                 type: number
 *                 description: Price per unit
 *               goal_id:
 *                 type: integer
 *                 description: Optional goal ID to associate with this trade
 *     responses:
 *       201:
 *         description: Sell transaction completed and trade log created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TradeLog'
 */

// ========== INSTRUMENTS ROUTES ==========

// Get all instruments
app.get('/instruments', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM instruments ORDER BY created_at DESC');
    // Convert decimal values to numbers
    const instruments = rows.map(row => ({
      ...row,
      current_price: Number(row.current_price)
    }));
    res.json(instruments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get instrument by ID
app.get('/instruments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM instruments WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Instrument not found' });
    }
    // Convert decimal values to numbers
    const instrument = {
      ...rows[0],
      current_price: Number(rows[0].current_price)
    };
    res.json(instrument);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new instrument
app.post('/instruments', async (req, res) => {
  const { symbol, name, type, current_price } = req.body;
  
  if (!symbol || !name || !type || !current_price) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  if (!['STOCK', 'MF', 'GOLD'].includes(type)) {
    return res.status(400).json({ error: 'Type must be STOCK, MF, or GOLD' });
  }
  
  try {
    const [result] = await db.query(
      'INSERT INTO instruments (symbol, name, type, current_price) VALUES (?, ?, ?, ?)',
      [symbol, name, type, current_price]
    );
    const [instrument] = await db.query('SELECT * FROM instruments WHERE id = ?', [result.insertId]);
    // Convert decimal values to numbers
    const newInstrument = {
      ...instrument[0],
      current_price: Number(instrument[0].current_price)
    };
    res.status(201).json(newInstrument);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update instrument
app.put('/instruments/:id', async (req, res) => {
  const { id } = req.params;
  const { symbol, name, type, current_price } = req.body;
  
  if (!symbol || !name || !type || !current_price) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  if (!['STOCK', 'MF', 'GOLD'].includes(type)) {
    return res.status(400).json({ error: 'Type must be STOCK, MF, or GOLD' });
  }
  
  try {
    const [result] = await db.query(
      'UPDATE instruments SET symbol = ?, name = ?, type = ?, current_price = ? WHERE id = ?',
      [symbol, name, type, current_price, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Instrument not found' });
    }
    
    const [instrument] = await db.query('SELECT * FROM instruments WHERE id = ?', [id]);
    // Convert decimal values to numbers
    const updatedInstrument = {
      ...instrument[0],
      current_price: Number(instrument[0].current_price)
    };
    res.json(updatedInstrument);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete instrument
app.delete('/instruments/:id', async (req, res) => {
  const { id } = req.params;
  const { cascade } = req.query; // Optional query parameter for cascade delete
  
  try {
    // Check if instrument has trade logs
    const [tradeLogs] = await db.query('SELECT COUNT(*) as count FROM trade_log WHERE instrument_id = ?', [id]);
    
    if (tradeLogs[0].count > 0) {
      if (cascade === 'true') {
        // Cascade delete: delete trade logs first, then instrument
        await db.query('DELETE FROM trade_log WHERE instrument_id = ?', [id]);
        const [result] = await db.query('DELETE FROM instruments WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Instrument not found' });
        }
        res.json({ message: 'Instrument and associated trade logs deleted' });
      } else {
        return res.status(400).json({ 
          error: 'Cannot delete instrument with existing trade history. Please delete all related trade logs first or use ?cascade=true parameter.' 
        });
      }
    } else {
      // No trade logs, safe to delete
      const [result] = await db.query('DELETE FROM instruments WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Instrument not found' });
      }
      res.json({ message: 'Instrument deleted' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== GOALS ROUTES ==========

// Get all goals
app.get('/goals', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM goals ORDER BY created_at DESC');
    // Convert decimal values to numbers
    const goals = rows.map(row => ({
      ...row,
      target_amount: Number(row.target_amount)
    }));
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get goal by ID
app.get('/goals/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM goals WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    // Convert decimal values to numbers
    const goal = {
      ...rows[0],
      target_amount: Number(rows[0].target_amount)
    };
    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new goal
app.post('/goals', async (req, res) => {
  const { name, target_amount } = req.body;
  
  if (!name || !target_amount) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  try {
    const [result] = await db.query(
      'INSERT INTO goals (name, target_amount) VALUES (?, ?)',
      [name, target_amount]
    );
    const [goal] = await db.query('SELECT * FROM goals WHERE id = ?', [result.insertId]);
    // Convert decimal values to numbers
    const newGoal = {
      ...goal[0],
      target_amount: Number(goal[0].target_amount)
    };
    res.status(201).json(newGoal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update goal
app.put('/goals/:id', async (req, res) => {
  const { id } = req.params;
  const { name, target_amount } = req.body;
  
  if (!name || !target_amount) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  try {
    const [result] = await db.query(
      'UPDATE goals SET name = ?, target_amount = ? WHERE id = ?',
      [name, target_amount, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    
    const [goal] = await db.query('SELECT * FROM goals WHERE id = ?', [id]);
    // Convert decimal values to numbers
    const updatedGoal = {
      ...goal[0],
      target_amount: Number(goal[0].target_amount)
    };
    res.json(updatedGoal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete goal
app.delete('/goals/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Check if goal has trade logs
    const [tradeLogs] = await db.query('SELECT COUNT(*) as count FROM trade_log WHERE goal_id = ?', [id]);
    
    if (tradeLogs[0].count > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete goal with existing trade history. Please delete all related trade logs first.' 
      });
    }
    
    const [result] = await db.query('DELETE FROM goals WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    res.json({ message: 'Goal deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== TRADE LOG ROUTES ==========

// Get all trade logs with instrument and goal details
app.get('/trade-log', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        tl.*,
        i.symbol as instrument_symbol,
        i.name as instrument_name,
        i.type as instrument_type,
        g.name as goal_name
      FROM trade_log tl
      LEFT JOIN instruments i ON tl.instrument_id = i.id
      LEFT JOIN goals g ON tl.goal_id = g.id
      ORDER BY tl.created_at DESC
    `);
    // Convert decimal values to numbers
    const tradeLogs = rows.map(row => ({
      ...row,
      quantity: Number(row.quantity),
      price: Number(row.price),
      total_amount: Number(row.total_amount)
    }));
    res.json(tradeLogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== TRADING ROUTES ==========

// Buy an instrument
app.post('/instruments/:id/buy', async (req, res) => {
  const { id } = req.params;
  const { quantity, price, goal_id } = req.body;
  
  if (!quantity || !price) {
    return res.status(400).json({ error: 'quantity and price are required' });
  }
  
  if (quantity <= 0 || price <= 0) {
    return res.status(400).json({ error: 'quantity and price must be positive' });
  }
  
  try {
    // Verify instrument exists
    const [instrument] = await db.query('SELECT id, symbol, name FROM instruments WHERE id = ?', [id]);
    if (instrument.length === 0) {
      return res.status(404).json({ error: 'Instrument not found' });
    }
    
    // Verify goal exists if provided
    if (goal_id) {
      const [goal] = await db.query('SELECT id FROM goals WHERE id = ?', [goal_id]);
      if (goal.length === 0) {
        return res.status(400).json({ error: 'Goal not found' });
      }
    }
    
    const total_amount = quantity * price;
    
    // Create trade log entry
    const [result] = await db.query(
      'INSERT INTO trade_log (instrument_id, goal_id, transaction_type, quantity, price, total_amount) VALUES (?, ?, ?, ?, ?, ?)',
      [id, goal_id || null, 'BUY', quantity, price, total_amount]
    );
    
    // Get the created trade log with details
    const [tradeLog] = await db.query(`
      SELECT 
        tl.*,
        i.symbol as instrument_symbol,
        i.name as instrument_name,
        i.type as instrument_type,
        g.name as goal_name
      FROM trade_log tl
      LEFT JOIN instruments i ON tl.instrument_id = i.id
      LEFT JOIN goals g ON tl.goal_id = g.id
      WHERE tl.id = ?
    `, [result.insertId]);
    
    res.status(201).json(tradeLog[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sell an instrument
app.post('/instruments/:id/sell', async (req, res) => {
  const { id } = req.params;
  const { quantity, price, goal_id } = req.body;
  
  if (!quantity || !price) {
    return res.status(400).json({ error: 'quantity and price are required' });
  }
  
  if (quantity <= 0 || price <= 0) {
    return res.status(400).json({ error: 'quantity and price must be positive' });
  }
  
  try {
    // Verify instrument exists
    const [instrument] = await db.query('SELECT id, symbol, name FROM instruments WHERE id = ?', [id]);
    if (instrument.length === 0) {
      return res.status(404).json({ error: 'Instrument not found' });
    }
    
    // Verify goal exists if provided
    if (goal_id) {
      const [goal] = await db.query('SELECT id FROM goals WHERE id = ?', [goal_id]);
      if (goal.length === 0) {
        return res.status(400).json({ error: 'Goal not found' });
      }
    }
    
    const total_amount = quantity * price;
    
    // Create trade log entry
    const [result] = await db.query(
      'INSERT INTO trade_log (instrument_id, goal_id, transaction_type, quantity, price, total_amount) VALUES (?, ?, ?, ?, ?, ?)',
      [id, goal_id || null, 'SELL', quantity, price, total_amount]
    );
    
    // Get the created trade log with details
    const [tradeLog] = await db.query(`
      SELECT 
        tl.*,
        i.symbol as instrument_symbol,
        i.name as instrument_name,
        i.type as instrument_type,
        g.name as goal_name
      FROM trade_log tl
      LEFT JOIN instruments i ON tl.instrument_id = i.id
      LEFT JOIN goals g ON tl.goal_id = g.id
      WHERE tl.id = ?
    `, [result.insertId]);
    
    res.status(201).json(tradeLog[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== SERVER START ==========

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Stock Broking App Backend Service running on port ${port}`);
});

