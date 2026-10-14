require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(helmet());
app.use(cors());

const AUTH_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:5001';
const ITEM_URL = process.env.ITEM_SERVICE_URL || 'http://localhost:5002';
const MATCH_URL = process.env.MATCHING_SERVICE_URL || 'http://localhost:5003';
const CLAIM_URL = process.env.CLAIM_SERVICE_URL || 'http://localhost:5004';
const NOTIFY_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5005';

app.use('/api/auth', createProxyMiddleware({ target: AUTH_URL, changeOrigin: true }));
app.use('/api/items', createProxyMiddleware({ target: ITEM_URL, changeOrigin: true }));
app.use('/api/matches', createProxyMiddleware({ target: MATCH_URL, changeOrigin: true }));
app.use('/api/claims', createProxyMiddleware({ target: CLAIM_URL, changeOrigin: true }));
app.use('/api/notifications', createProxyMiddleware({ target: NOTIFY_URL, changeOrigin: true }));

app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime())
  });
});

app.use((err, req, res, next) => {
  console.error('Gateway Error:', err.message);
  res.status(500).json({ error: 'Gateway Proxy Error', message: err.message });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});
