const Restaurant = require('../models/Restaurant');

exports.getAll = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ err: 'Restaurant not found' });
        res.json(restaurant);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const restaurant = await Restaurant.create(req.body);
        res.status(201).json(restaurant);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!restaurant) return res.status(404).json({ err: 'Restaurant not found' });
        res.json(restaurant);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
        if (!restaurant) return res.status(404).json({ err: 'Restaurant not found' });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

exports.getMenu = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ err: 'Restaurant not found' });
        res.json(restaurant.menu);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

exports.addMenuItem = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ err: 'Restaurant not found' });
        restaurant.menu.push(req.body);
        await restaurant.save();
        res.status(201).json(restaurant);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};
