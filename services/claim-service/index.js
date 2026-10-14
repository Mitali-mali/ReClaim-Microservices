require('dotenv').config({ path: '../../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const claimRoutes = require('./routes/claimRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI_CLAIM || 'mongodb://localhost:27017/reclaim_claim')
  .then(() => console.log('Claim Service DB Connected'))
  .catch(err => console.error('DB Connection Error:', err));

app.use('/api/claims', claimRoutes);

app.get('/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(isDbConnected ? 200 : 503).json({
    status: isDbConnected ? 'UP' : 'DEGRADED',
    service: 'claim-service',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: isDbConnected ? 'CONNECTED' : 'DISCONNECTED'
  });
});

const PORT = process.env.CLAIM_SERVICE_PORT || 5004;
app.listen(PORT, () => console.log(`Claim Service running on port ${PORT}`));
