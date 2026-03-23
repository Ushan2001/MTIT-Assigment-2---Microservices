const express = require('express');
const router = express.Router();
const controller = require('../controllers/restaurantController');

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Retrieve all restaurants
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: List of all restaurants
 *   post:
 *     summary: Create a restaurant
 *     tags: [Restaurants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, address, cuisine]
 *             properties:
 *               name: { type: string }
 *               address: { type: string }
 *               cuisine: { type: string }
 *               rating: { type: number }
 *     responses:
 *       201:
 *         description: Created
 */
router.get('/api/restaurants', controller.getAll);
router.post('/api/restaurants', controller.create);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Get restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *   put:
 *     summary: Update restaurant by ID
 *     tags: [Restaurants]
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
 *               name: { type: string }
 *               address: { type: string }
 *               cuisine: { type: string }
 *               rating: { type: number }
 *   delete:
 *     summary: Delete restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 */
router.get('/api/restaurants/:id', controller.getById);
router.put('/api/restaurants/:id', controller.update);
router.delete('/api/restaurants/:id', controller.remove);

/**
 * @swagger
 * /api/restaurants/{id}/menu:
 *   get:
 *     summary: Get restaurant menu
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *   post:
 *     summary: Add a menu item
 *     tags: [Restaurants]
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
 *             required: [itemName, price]
 *             properties:
 *               itemName: { type: string }
 *               price: { type: number }
 *               description: { type: string }
 *               available: { type: boolean }
 */
router.get('/api/restaurants/:id/menu', controller.getMenu);
router.post('/api/restaurants/:id/menu', controller.addMenuItem);

module.exports = router;
