const Customer = require('../models/Customer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');

exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().select('-passwordHash');
        res.json(customers);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ err: 'name, email and password are required' });
        }
        const existing = await Customer.findOne({ email });
        if (existing) return res.status(409).json({ err: 'Email already registered' });

        const passwordHash = await bcrypt.hash(password, 10);
        const customer = await Customer.create({ name, email, passwordHash, phone, address });
        const { passwordHash: _, ...safe } = customer.toObject();
        res.status(201).json(safe);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ err: 'email and password are required' });

        const customer = await Customer.findOne({ email });
        if (!customer) return res.status(401).json({ err: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, customer.passwordHash);
        if (!valid) return res.status(401).json({ err: 'Invalid credentials' });

        const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET || 'supersecret123', { expiresIn: '7d' });
        res.json({ token, id: customer._id });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id).select('-passwordHash');
        if (!customer) return res.status(404).json({ err: 'Customer not found' });
        res.json(customer);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        // Prevent password update through this route
        delete req.body.passwordHash;
        delete req.body.password;
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-passwordHash');
        if (!customer) return res.status(404).json({ err: 'Customer not found' });
        res.json({ msg: 'Profile updated successfully', customer });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

exports.removeAccount = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) return res.status(404).json({ err: 'Customer not found' });
        res.json({ msg: 'Account deleted successfully' });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3002';
        const { data } = await axios.get(`${ORDER_SERVICE_URL}/api/orders`, {
            params: { customerId: req.params.id }
        });
        res.json(data);
    } catch (err) {
        res.status(502).json({ err: 'Could not reach order-service', detail: err.message });
    }
};
