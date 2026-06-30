require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./db/mongodb');

const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const essentialRoutes = require('./routes/essentials');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/essentials', essentialRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Xarajat Statistika API ishlayapti' });
});

app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} da ishlamoqda`);
});
