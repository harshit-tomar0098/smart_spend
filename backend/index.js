const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SmartSpend API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
