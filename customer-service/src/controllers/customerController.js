const Customer = require('../models/Customer');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    // dummy hash for this assignment
    const customer = await Customer.create({ name, email, passwordHash: password });
    res.status(201).json(customer);
};
exports.login = async (req, res) => {
    const { email, password } = req.body;
    const c = await Customer.findOne({ email });
    if(c && c.passwordHash === password) {
        const token = jwt.sign({id: c._id}, process.env.JWT_SECRET || 'supersecret123');
        res.json({ token });
    } else {
        res.status(401).json({err: "Unauthorized"});
    }
};
exports.getProfile = async (req, res) => res.json(await Customer.findById(req.params.id));
exports.updateProfile = async (req, res) => res.json(await Customer.findByIdAndUpdate(req.params.id, req.body, {new: true}));
exports.removeAccount = async (req, res) => { await Customer.findByIdAndDelete(req.params.id); res.json({msg: 'Deleted'}); };
exports.getOrders = async (req, res) => res.json({ msg: "Fetch from order-service dummy" });
