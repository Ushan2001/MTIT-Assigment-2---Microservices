const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use('/restaurants', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true, pathRewrite: { '^/restaurants': '/api/restaurants' } }));
app.use('/orders', createProxyMiddleware({ target: 'http://localhost:3002', changeOrigin: true, pathRewrite: { '^/orders': '/api/orders' } }));
app.use('/customers', createProxyMiddleware({ target: 'http://localhost:3003', changeOrigin: true, pathRewrite: { '^/customers': '/api/customers' } }));
app.use('/delivery', createProxyMiddleware({ target: 'http://localhost:3004', changeOrigin: true, pathRewrite: { '^/delivery': '/api/deliveries' } }));

app.listen(5000, () => {
  console.log('API Gateway running on http://localhost:5000');
});
