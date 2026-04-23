const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const app = express();

app.use(cors()); // Enable CORS for all routes

const gatewayPort = process.env.PORT || 5001;

function normalizeGlob(globPath) {
  return globPath.replace(/\\/g, '/');
}

function createServiceSpec(serviceTitle, routeGlob) {
  return swaggerJsDoc({
    definition: {
      openapi: '3.0.0',
      info: {
        title: `${serviceTitle} API`,
        version: '1.0.0',
        description: `${serviceTitle} endpoints exposed through API Gateway`
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      security: [{ bearerAuth: [] }]
    },
    apis: [normalizeGlob(routeGlob)]
  });
}

function buildMergedSwaggerSpec() {
  const serviceConfigs = [
    {
      title: 'Restaurant Service',
      routeGlob: path.join(__dirname, '..', 'restaurant-service', 'src', 'routes', '*.js'),
      internalBasePath: '/api/restaurants',
      gatewayBasePath: '/restaurants'
    },
    {
      title: 'Order Service',
      routeGlob: path.join(__dirname, '..', 'order-service', 'src', 'routes', '*.js'),
      internalBasePath: '/api/orders',
      gatewayBasePath: '/orders'
    },
    {
      title: 'Customer Service',
      routeGlob: path.join(__dirname, '..', 'customer-service', 'src', 'routes', '*.js'),
      internalBasePath: '/api/customers',
      gatewayBasePath: '/customers'
    },
    {
      title: 'Delivery Service',
      routeGlob: path.join(__dirname, '..', 'delivery-service', 'src', 'routes', '*.js'),
      internalBasePath: '/api/deliveries',
      gatewayBasePath: '/deliveries'
    }
  ];

  const mergedSpec = {
    openapi: '3.0.0',
    info: {
      title: 'API Gateway',
      version: '1.0.0',
      description: 'Unified API documentation for all microservices via API Gateway'
    },
    servers: [{ url: '/' }],
    paths: {},
    tags: [],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  };

  const seenTags = new Set();

  serviceConfigs.forEach((service) => {
    const serviceSpec = createServiceSpec(service.title, service.routeGlob);

    Object.entries(serviceSpec.paths || {}).forEach(([servicePath, pathItem]) => {
      const gatewayPath = servicePath.startsWith(service.internalBasePath)
        ? servicePath.replace(service.internalBasePath, service.gatewayBasePath)
        : servicePath;

      mergedSpec.paths[gatewayPath] = {
        ...(mergedSpec.paths[gatewayPath] || {}),
        ...pathItem
      };

      Object.values(pathItem).forEach((operation) => {
        if (operation && Array.isArray(operation.tags)) {
          operation.tags.forEach((tag) => {
            if (!seenTags.has(tag)) {
              seenTags.add(tag);
              mergedSpec.tags.push({ name: tag });
            }
          });
        }
      });
    });

    Object.entries(serviceSpec.components || {}).forEach(([componentType, componentValues]) => {
      if (!mergedSpec.components[componentType]) {
        mergedSpec.components[componentType] = {};
      }

      Object.entries(componentValues || {}).forEach(([componentName, componentSchema]) => {
        if (!mergedSpec.components[componentType][componentName]) {
          mergedSpec.components[componentType][componentName] = componentSchema;
        }
      });
    });
  });

  return mergedSpec;
}

const mergedSwaggerSpec = buildMergedSwaggerSpec();

app.get('/api-docs.json', (req, res) => {
  res.json(mergedSwaggerSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(mergedSwaggerSpec, {
  explorer: true,
  customSiteTitle: 'API Gateway - Unified Swagger'
}));

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

app.listen(gatewayPort, () => {
  console.log(`API Gateway running on http://localhost:${gatewayPort}`);
  console.log(`Unified Swagger UI: http://localhost:${gatewayPort}/api-docs`);
});
