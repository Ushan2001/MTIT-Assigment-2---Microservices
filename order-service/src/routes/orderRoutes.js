const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (supports ?customerId=&restaurantId= filters)
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: customerId
 *         schema: { type: string }
 *       - in: query
 *         name: restaurantId
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of orders
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [customerId, restaurantId, items]
 *             properties:
 *               customerId: { type: string }
 *               restaurantId: { type: string }
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     menuItemId: { type: string }
 *                     qty: { type: integer }
 *                     price: { type: number }
 */
router.get('/api/orders', controller.getAllOrders);
router.post('/api/orders', controller.createOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *   delete:
 *     summary: Cancel/delete order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 */
router.get('/api/orders/:id', controller.getOrderById);
router.delete('/api/orders/:id', controller.removeOrder);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED]
 */
router.put('/api/orders/:id/status', controller.updateStatus);

/**
 * @swagger
 * /api/orders/cart:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [customerId, menuItemId, qty, price]
 *             properties:
 *               customerId: { type: string }
 *               menuItemId: { type: string }
 *               qty: { type: integer }
 *               price: { type: number }
 */
router.post('/api/orders/cart', controller.addToCart);

/**
 * @swagger
 * /api/orders/cart/{customerId}:
 *   get:
 *     summary: Get cart for a customer
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema: { type: string }
 */
router.get('/api/orders/cart/:customerId', controller.getCart);

module.exports = router;
