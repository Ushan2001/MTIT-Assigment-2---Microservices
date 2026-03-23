const express = require('express');
const router = express.Router();
const controller = require('../controllers/deliveryController');

/**
 * @swagger
 * /api/deliveries:
 *   get:
 *     summary: Get all deliveries
 *     tags: [Deliveries]
 *   post:
 *     summary: Create a new delivery assignment
 *     tags: [Deliveries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId, pickupLocation, dropLocation]
 *             properties:
 *               orderId: { type: string }
 *               driverId: { type: string }
 *               pickupLocation: { type: string }
 *               dropLocation: { type: string }
 *               estimatedTime: { type: string }
 */
router.get('/api/deliveries', controller.getAllDel);
router.post('/api/deliveries', controller.createDel);

/**
 * @swagger
 * /api/deliveries/{id}:
 *   get:
 *     summary: Get delivery by ID
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 */
router.get('/api/deliveries/:id', controller.getDelById);

/**
 * @swagger
 * /api/deliveries/{id}/status:
 *   put:
 *     summary: Update delivery status
 *     tags: [Deliveries]
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
 *                 enum: [ASSIGNED, PICKED_UP, IN_TRANSIT, DELIVERED, FAILED]
 */
router.put('/api/deliveries/:id/status', controller.updateStatus);

/**
 * @swagger
 * /api/drivers:
 *   get:
 *     summary: List all drivers
 *     tags: [Drivers]
 *   post:
 *     summary: Register a new driver
 *     tags: [Drivers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 */
router.get('/api/drivers', controller.getAllDrivers);
router.post('/api/drivers', controller.createDriver);

/**
 * @swagger
 * /api/drivers/{id}:
 *   put:
 *     summary: Update driver availability
 *     tags: [Drivers]
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
 *             properties:
 *               available: { type: boolean }
 *               name: { type: string }
 */
router.put('/api/drivers/:id', controller.updateDriver);

module.exports = router;
