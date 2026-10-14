require('dotenv').config({ path: '../../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI_NOTIFICATION || 'mongodb://localhost:27017/reclaim_notification')
  .then(() => console.log('Notification Service DB Connected'))
  .catch(err => console.error('DB Connection Error:', err));

app.use('/api/notifications', notificationRoutes);

app.get('/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(isDbConnected ? 200 : 503).json({
    status: isDbConnected ? 'UP' : 'DEGRADED',
    service: 'notification-service',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: isDbConnected ? 'CONNECTED' : 'DISCONNECTED'
  });
});

const PORT = process.env.NOTIFICATION_SERVICE_PORT || 5005;
app.listen(PORT, () => console.log(`Notification Service running on port ${PORT}`));
