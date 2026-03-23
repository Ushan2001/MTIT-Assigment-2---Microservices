const express = require('express');
const router = express.Router();
const controller = require('../controllers/deliveryController');

/**
 * @swagger
 * /api/deliveries:
 *   get:
 *     summary: all deliveries
 *     tags: [Deliveries]
 *   post:
 *     summary: Create delivery
 *     tags: [Deliveries]
 */
router.get('/api/deliveries', controller.getAllDel);
router.post('/api/deliveries', controller.createDel);

/**
 * @swagger
 * /api/deliveries/{id}:
 *   get:
 *     summary: get delivery
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
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
 */
router.put('/api/deliveries/:id/status', controller.updateStatus);


/**
 * @swagger
 * /api/drivers:
 *   get:
 *     summary: List drivers
 *     tags: [Drivers]
 *   post:
 *     summary: Register driver
 *     tags: [Drivers]
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
 */
router.put('/api/drivers/:id', controller.updateDriver);

module.exports = router;
