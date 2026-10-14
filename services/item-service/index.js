require('dotenv').config({ path: '../../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const itemRoutes = require('./routes/itemRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI_ITEM || 'mongodb://localhost:27017/reclaim_item')
  .then(() => console.log('Item Service DB Connected'))
  .catch(err => console.error('DB Connection Error:', err));

app.use('/api/items', itemRoutes);

app.get('/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(isDbConnected ? 200 : 503).json({
    status: isDbConnected ? 'UP' : 'DEGRADED',
    service: 'item-service',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: isDbConnected ? 'CONNECTED' : 'DISCONNECTED'
  });
});

const PORT = process.env.ITEM_SERVICE_PORT || 5002;
app.listen(PORT, () => console.log(`Item Service running on port ${PORT}`));
