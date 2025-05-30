require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const productRouter = require('./server/routes/products');
const ordersRouter = require('./server/routes/orders');
const userRouter = require('./server/routes/user');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Attach pool to every request
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

// ✅ API routes
app.use('/products', productRouter);
app.use('/orders', ordersRouter);
app.use('/auth', userRouter);

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
