const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Delivery Service API',
      version: '1.0.0',
      description: 'API documentation'
    },
    servers: [{ url: 'http://localhost:3004' }]
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerJsDoc(options);
