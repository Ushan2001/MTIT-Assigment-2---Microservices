const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *       - in: query
 *         name: restaurantId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of orders
 *       500:
 *         description: Server error
 *
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
 *               customerId:
 *                 type: string
 *                 minLength: 1
 *               restaurantId:
 *                 type: string
 *                 minLength: 1
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required: [menuItemId, qty, price]
 *                   properties:
 *                     menuItemId:
 *                       type: string
 *                       minLength: 1
 *                     qty:
 *                       type: integer
 *                       minimum: 1
 *                     price:
 *                       type: number
 *                       minimum: 0.01
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.get('/api/orders', controller.getAllOrders);
router.post('/api/orders', controller.createOrder);

/**
 * @swagger
 * /api/orders/cart:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
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
 *         schema:
 *           type: string
 */
router.get('/api/orders/cart/:customerId', controller.getCart);

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
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Cancel/delete order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
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
 *         schema:
 *           type: string
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
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Order not found
 */
router.put('/api/orders/:id/status', controller.updateStatus);

module.exports = router;