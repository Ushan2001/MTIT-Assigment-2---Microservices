const express = require('express');
const router = express.Router();
const controller = require('../controllers/customerController');

/**
 * @swagger
 * /api/customers/register:
 *   post:
 *     summary: Register
 *     tags: [Customers]
 */
router.post('/api/customers/register', controller.register);

/**
 * @swagger
 * /api/customers/login:
 *   post:
 *     summary: Login and receive JWT token
 *     tags: [Customers]
 */
router.post('/api/customers/login', controller.login);

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Get profile
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *   put:
 *     summary: Update profile
 *     tags: [Customers]
 *   delete:
 *     summary: delete account
 *     tags: [Customers]
 */
router.get('/api/customers/:id', controller.getProfile);
router.put('/api/customers/:id', controller.updateProfile);
router.delete('/api/customers/:id', controller.removeAccount);

/**
 * @swagger
 * /api/customers/{id}/orders:
 *   get:
 *     summary: Get orders
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.get('/api/customers/:id/orders', controller.getOrders);

module.exports = router;
