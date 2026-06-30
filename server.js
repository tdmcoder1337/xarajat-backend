require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./db/mongodb');

const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const essentialRoutes = require('./routes/essentials');

const app = express();
const PORT = process.env.PORT || 5000;

// Reflect the request origin so any frontend (xarajat.vercel.app, localhost, etc.)
// can call the API. Auth uses a Bearer token in headers, not cookies.
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/essentials', essentialRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Xarajat Statistika API ishlayapti' });
});

// Vercel serverless: export the app. Locally: start a listener.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server http://localhost:${PORT} da ishlamoqda`);
  });
}

module.exports = app;
