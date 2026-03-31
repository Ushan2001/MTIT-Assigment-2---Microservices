const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use(cors()); // Enable CORS for all routes

// --- Documentation Proxy Routes ---
app.use('/restaurants/docs', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true, pathRewrite: { '^/restaurants/docs': '/api-docs' } }));
app.use('/orders/docs', createProxyMiddleware({ target: 'http://localhost:3002', changeOrigin: true, pathRewrite: { '^/orders/docs': '/api-docs' } }));
app.use('/customers/docs', createProxyMiddleware({ target: 'http://localhost:3003', changeOrigin: true, pathRewrite: { '^/customers/docs': '/api-docs' } }));
app.use('/deliveries/docs', createProxyMiddleware({ target: 'http://localhost:3004', changeOrigin: true, pathRewrite: { '^/deliveries/docs': '/api-docs' } }));

// --- API Proxy Routes ---
app.use('/restaurants', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true, pathRewrite: { '^/restaurants': '/api/restaurants' } }));
app.use('/orders', createProxyMiddleware({ target: 'http://localhost:3002', changeOrigin: true, pathRewrite: { '^/orders': '/api/orders' } }));
app.use('/customers', createProxyMiddleware({ target: 'http://localhost:3003', changeOrigin: true, pathRewrite: { '^/customers': '/api/customers' } }));
app.use('/deliveries', createProxyMiddleware({ target: 'http://localhost:3004', changeOrigin: true, pathRewrite: { '^/deliveries': '/api/deliveries' } }));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});
