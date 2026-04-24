const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');

/**
 * @swagger
 * /api/orders:
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: "Quantity must be greater than 0"
 *       500:
 *         description: Server error
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
 *                 minLength: 1
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid status or empty value
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: "Status must be one of: PENDING, CONFIRMED..."
 *       404:
 *         description: Order not found
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
 *               customerId:
 *                 type: string
 *                 minLength: 1
 *               menuItemId:
 *                 type: string
 *                 minLength: 1
 *               qty:
 *                 type: integer
 *                 minimum: 1
 *               price:
 *                 type: number
 *                 minimum: 0.01
 *     responses:
 *       201:
 *         description: Item added to cart
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: "Quantity must be greater than 0"
 *       500:
 *         description: Server error
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
