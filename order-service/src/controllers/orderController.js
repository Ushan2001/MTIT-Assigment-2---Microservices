const Order = require('../models/Order');

exports.getAllOrders = async (req, res) => {
    try {
        const filter = {};
        if (req.query.customerId) filter.customerId = req.query.customerId;
        if (req.query.restaurantId) filter.restaurantId = req.query.restaurantId;
        const orders = await Order.find(filter);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ err: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

// exports.createOrder = async (req, res) => {
//     try {
//         const { customerId, restaurantId, items } = req.body;
//         if (!customerId || !restaurantId || !items || items.length === 0) {
//             return res.status(400).json({ err: 'customerId, restaurantId and items are required' });
//         }
//         const totalAmount = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
//         const order = await Order.create({ customerId, restaurantId, items, totalAmount, status: 'PENDING' });
//         res.status(201).json(order);
//     } catch (err) {
//         res.status(500).json({ err: err.message });
//     }
// };

exports.createOrder = async (req, res) => {
    try {
        const { customerId, restaurantId, items } = req.body;

        // 🔥 Check empty strings also
        if (!customerId || customerId.trim() === '') {
            return res.status(400).json({ err: 'customerId cannot be empty' });
        }

        if (!restaurantId || restaurantId.trim() === '') {
            return res.status(400).json({ err: 'restaurantId cannot be empty' });
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ err: 'items array is required and cannot be empty' });
        }

        for (const item of items) {
            if (!item.menuItemId || item.menuItemId.trim() === '') {
                return res.status(400).json({ err: 'menuItemId cannot be empty' });
            }

            if (typeof item.qty !== 'number' || item.qty <= 0) {
                return res.status(400).json({ err: 'Quantity must be greater than 0' });
            }

            if (typeof item.price !== 'number' || item.price <= 0) {
                return res.status(400).json({ err: 'Price must be greater than 0' });
            }
        }

        const totalAmount = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

        const order = await Order.create({
            customerId,
            restaurantId,
            items,
            totalAmount,
            status: 'PENDING'
        });

        res.status(201).json(order);

    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

// exports.updateStatus = async (req, res) => {
//     try {
//         const { status } = req.body;
//         const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
//         if (!validStatuses.includes(status)) {
//             return res.status(400).json({ err: `Status must be one of: ${validStatuses.join(', ')}` });
//         }
//         const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
//         if (!order) return res.status(404).json({ err: 'Order not found' });
//         res.json(order);
//     } catch (err) {
//         res.status(500).json({ err: err.message });
//     }
// };

exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ err: 'Status is required' });
        }

        const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ err: `Status must be one of: ${validStatuses.join(', ')}` });
        }

        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (!order) return res.status(404).json({ err: 'Order not found' });

        res.json(order);

    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

exports.removeOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ err: 'Order not found' });
        res.json({ message: 'Order cancelled' });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

// Cart — stored in memory per session (simple implementation for assignment)
const cartStore = {};

exports.getCart = async (req, res) => {
    try {
        const cart = cartStore[req.params.customerId] || { items: [], total: 0 };
        res.json(cart);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

// exports.addToCart = async (req, res) => {
//     try {
//         const { customerId, menuItemId, qty, price } = req.body;
//         if (!customerId || !menuItemId || !qty || !price) {
//             return res.status(400).json({ err: 'customerId, menuItemId, qty and price are required' });
//         }
//         if (!cartStore[customerId]) cartStore[customerId] = { items: [], total: 0 };
//         const existing = cartStore[customerId].items.find(i => i.menuItemId === menuItemId);
//         if (existing) {
//             existing.qty += qty;
//         } else {
//             cartStore[customerId].items.push({ menuItemId, qty, price });
//         }
//         cartStore[customerId].total = cartStore[customerId].items.reduce((s, i) => s + i.price * i.qty, 0);
//         res.status(201).json(cartStore[customerId]);
//     } catch (err) {
//         res.status(500).json({ err: err.message });
//     }
// };

exports.addToCart = async (req, res) => {
    try {
        const { customerId, menuItemId, qty, price } = req.body;

        if (!customerId || customerId.trim() === '') {
            return res.status(400).json({ err: 'customerId cannot be empty' });
        }

        if (!menuItemId || menuItemId.trim() === '') {
            return res.status(400).json({ err: 'menuItemId cannot be empty' });
        }

        if (typeof qty !== 'number' || qty <= 0) {
            return res.status(400).json({ err: 'Quantity must be greater than 0' });
        }

        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({ err: 'Price must be greater than 0' });
        }

        if (!cartStore[customerId]) {
            cartStore[customerId] = { items: [], total: 0 };
        }

        const existing = cartStore[customerId].items.find(i => i.menuItemId === menuItemId);

        if (existing) {
            existing.qty += qty;
        } else {
            cartStore[customerId].items.push({ menuItemId, qty, price });
        }

        cartStore[customerId].total = cartStore[customerId].items.reduce((s, i) => s + i.price * i.qty, 0);

        res.status(201).json(cartStore[customerId]);

    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};