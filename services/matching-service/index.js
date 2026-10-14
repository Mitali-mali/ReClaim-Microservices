require('dotenv').config({ path: '../../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const matchRoutes = require('./routes/matchRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI_MATCHING || 'mongodb://localhost:27017/reclaim_matching')
  .then(() => console.log('Matching Service DB Connected'))
  .catch(err => console.error('DB Connection Error:', err));

app.use('/api/matches', matchRoutes);

app.get('/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(isDbConnected ? 200 : 503).json({
    status: isDbConnected ? 'UP' : 'DEGRADED',
    service: 'matching-service',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: isDbConnected ? 'CONNECTED' : 'DISCONNECTED'
  });
});

const PORT = process.env.MATCHING_SERVICE_PORT || 5003;
app.listen(PORT, () => console.log(`Matching Service running on port ${PORT}`));
