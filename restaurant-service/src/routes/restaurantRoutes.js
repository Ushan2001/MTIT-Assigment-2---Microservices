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
 *   put:
 *     summary: Update restaurant by ID
 *     tags: [Restaurants]
 *   delete:
 *     summary: Delete restaurant by ID
 *     tags: [Restaurants]
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
 *   post:
 *     summary: Add menu item
 *     tags: [Restaurants]
 */
router.get('/api/restaurants/:id/menu', controller.getMenu);
router.post('/api/restaurants/:id/menu', controller.addMenuItem);

module.exports = router;
