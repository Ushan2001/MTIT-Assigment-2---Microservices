const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: list
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 */
router.get('/api/orders', controller.getAllOrders);
router.post('/api/orders', controller.createOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by id
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *   delete:
 *     summary: Cancel order
 *     tags: [Orders]
 */
router.get('/api/orders/:id', controller.getOrderById);
router.delete('/api/orders/:id', controller.removeOrder);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update status
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.put('/api/orders/:id/status', controller.updateStatus);

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add to cart
 *     tags: [Cart]
 */
router.post('/api/cart', controller.addToCart);

/**
 * @swagger
 * /api/cart/{customerId}:
 *   get:
 *     summary: get cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 */
router.get('/api/cart/:customerId', controller.getCart);

module.exports = router;
