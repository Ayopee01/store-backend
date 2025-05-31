require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const productRouter = require('./server/routes/products');
const ordersRouter = require('./server/routes/orders');
const userRouter = require('./server/routes/user');

const app = express();

// ✅ CORS Middleware (ระบุ origin ที่ไว้ใจได้ หรือใช้ "*" ชั่วคราวช่วง dev)
app.use(cors({
  origin: [
    "https://shoppingonline-pink.vercel.app", // Production domain
    "http://localhost:5173" // Local dev
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Body Parser
app.use(express.json());

// ✅ MySQL Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Attach pool to req
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

// ✅ API Routes
app.use('/products', productRouter);
app.use('/orders', ordersRouter);
app.use('/auth', userRouter); // login, register endpoint อยู่ที่ /auth

// ✅ Health Check
app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: '❌ API route not found' });
});

// ✅ Error Handler (ป้องกัน process ตาย)
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

// ✅ Start Server (ใช้ PORT จาก env หรือ 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
