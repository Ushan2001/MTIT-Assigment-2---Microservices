const express = require('express');
const router = express.Router();
const controller = require('../controllers/customerController');
const authenticate = require('../middleware/auth');

/**
 * @swagger
 * /api/customers/register:
 *   post:
 *     summary: Register a new customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               phone: { type: string }
 *               address: { type: string }
 *     responses:
 *       201:
 *         description: Customer registered
 *       409:
 *         description: Email already registered
 */
router.post('/api/customers/register', controller.register);

/**
 * @swagger
 * /api/customers/login:
 *   post:
 *     summary: Login and receive JWT token
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: JWT token returned
 *       401:
 *         description: Invalid credentials
 */
router.post('/api/customers/login', controller.login);

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all customers
 * /api/customers/{id}:
 *   put:
 *     summary: Update customer profile
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address: { type: string }
 *     responses:
 *       200:
 *         description: Profile updated
 *   delete:
 *     summary: Delete customer account
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Account deleted successfully
 */
router.get('/api/customers', authenticate, controller.getAllCustomers);
router.get('/api/customers/:id', authenticate, controller.getProfile);
router.put('/api/customers/:id', authenticate, controller.updateProfile);
router.delete('/api/customers/:id', authenticate, controller.removeAccount);

/**
 * @swagger
 * /api/customers/{id}/orders:
 *   get:
 *     summary: Get all orders for a customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 */
router.get('/api/customers/:id/orders', authenticate, controller.getOrders);

module.exports = router;
