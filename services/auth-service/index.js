require('dotenv').config({ path: '../../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI_AUTH || 'mongodb://localhost:27017/reclaim_auth')
  .then(() => console.log('Auth Service DB Connected'))
  .catch(err => console.error('DB Connection Error:', err));

app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(isDbConnected ? 200 : 503).json({
    status: isDbConnected ? 'UP' : 'DEGRADED',
    service: 'auth-service',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: isDbConnected ? 'CONNECTED' : 'DISCONNECTED'
  });
});

const PORT = process.env.AUTH_SERVICE_PORT || 5001;
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
