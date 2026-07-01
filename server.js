require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('./db/mongodb');

const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const essentialRoutes = require('./routes/essentials');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/essentials', essentialRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Xarajat Statistika API ishlayapti' });
});

app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  const states = { 0: 'uzilgan', 1: 'ulangan', 2: 'ulanmoqda', 3: 'uzilmoqda' };
  res.json({
    status: dbState === 1 ? 'ok' : 'xato',
    db: states[dbState] || 'noma\'lum',
    env: {
      mongodb_uri: !!process.env.MONGODB_URI,
      jwt_secret: !!process.env.JWT_SECRET,
    },
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server http://localhost:${PORT} da ishlamoqda`);
  });
}

module.exports = app;
