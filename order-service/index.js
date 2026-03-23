const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/swagger');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const routes = require('./src/routes/orderRoutes.js');
// we can mount everything to / since routers will handle their own paths or mount to baseUrl
// Let's adopt the latter
app.use('/', routes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for order-service'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`order-service on port ${PORT}`));
