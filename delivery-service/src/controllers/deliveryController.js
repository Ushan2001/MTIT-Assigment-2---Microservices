const Delivery = require('../models/Delivery');

exports.getAllDel = async (req, res) => {
    try {
        const deliveries = await Delivery.find();
        res.json(deliveries);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

exports.getDelById = async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.id);
        if (!delivery) return res.status(404).json({ err: 'Delivery not found' });
        res.json(delivery);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

exports.createDel = async (req, res) => {
    try {
        const { orderId, driverId, pickupLocation, dropLocation, estimatedTime } = req.body;
        if (!orderId || !pickupLocation || !dropLocation) {
            return res.status(400).json({ err: 'orderId, pickupLocation and dropLocation are required' });
        }
        const delivery = await Delivery.create({ orderId, driverId, pickupLocation, dropLocation, estimatedTime });
        res.status(201).json(delivery);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const validStatuses = ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'FAILED'];
        const { status } = req.body;
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ err: `Status must be one of: ${validStatuses.join(', ')}` });
        }
        const delivery = await Delivery.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!delivery) return res.status(404).json({ err: 'Delivery not found' });
        res.json(delivery);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

// In-memory driver store (for assignment purposes)
const drivers = [
    { id: 'd1', name: 'Driver One', available: true },
    { id: 'd2', name: 'Driver Two', available: false }
];

exports.getAllDrivers = async (req, res) => {
    try {
        res.json(drivers);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

exports.createDriver = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ err: 'name is required' });
        const newDriver = { id: `d${Date.now()}`, name, available: true };
        drivers.push(newDriver);
        res.status(201).json(newDriver);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

exports.updateDriver = async (req, res) => {
    try {
        const driver = drivers.find(d => d.id === req.params.id);
        if (!driver) return res.status(404).json({ err: 'Driver not found' });
        if (req.body.available !== undefined) driver.available = req.body.available;
        if (req.body.name) driver.name = req.body.name;
        res.json(driver);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};
