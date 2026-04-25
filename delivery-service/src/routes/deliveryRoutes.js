const express = require('express');
const router = express.Router();
const controller = require('../controllers/deliveryController');

/**
 * @swagger
 * /api/deliveries:
 *   get:
 *     summary: Get all deliveries
 *     tags: [Deliveries]
 *     responses:
 *       200:
 *         description: List of deliveries
 *       500:
 *         description: Server error
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
 *               orderId:
 *                 type: string
 *                 minLength: 1
 *               driverId:
 *                 type: string
 *                 minLength: 1
 *               pickupLocation:
 *                 type: string
 *                 minLength: 1
 *               dropLocation:
 *                 type: string
 *                 minLength: 1
 *               estimatedTime:
 *                 type: string
 *                 minLength: 1
 *     responses:
 *       201:
 *         description: Delivery created successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: "pickupLocation cannot be empty"
 *       500:
 *         description: Server error
 */
router.get('/api/deliveries', controller.getAllDel);
router.post('/api/deliveries', controller.createDel);

/**
 * @swagger
 * /api/deliveries/drivers:
 *   get:
 *     summary: List all drivers
 *     tags: [Drivers]
 *     responses:
 *       200:
 *         description: List of drivers
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
 *               name:
 *                 type: string
 *                 minLength: 1
 *     responses:
 *       201:
 *         description: Driver created
 *       400:
 *         description: Validation error
 */
router.get('/api/deliveries/drivers', controller.getAllDrivers);
router.post('/api/deliveries/drivers', controller.createDriver);

/**
 * @swagger
 * /api/deliveries/drivers/{id}:
 *   put:
 *     summary: Update driver details
 *     tags: [Drivers]
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
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *               available:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Driver updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Driver not found
 *   delete:
 *     summary: Delete a driver
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Driver deleted successfully
 *       404:
 *         description: Driver not found
 */
router.put('/api/deliveries/drivers/:id', controller.updateDriver);
router.delete('/api/deliveries/drivers/:id', controller.deleteDriver);

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
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Delivery details
 *       404:
 *         description: Delivery not found
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
 *                 enum: [ASSIGNED, PICKED_UP, IN_TRANSIT, DELIVERED, FAILED]
 *                 minLength: 1
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid or empty status
 *       404:
 *         description: Delivery not found
 */
router.put('/api/deliveries/:id/status', controller.updateStatus);

module.exports = router;