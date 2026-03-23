const Order = require('../models/Order');
exports.getAllOrders = async (req, res) => res.json(await Order.find());
exports.getOrderById = async (req, res) => res.json(await Order.findById(req.params.id));
exports.createOrder = async (req, res) => res.status(201).json(await Order.create(req.body));
exports.updateStatus = async (req, res) => res.json(await Order.findByIdAndUpdate(req.params.id, {status: req.body.status}, {new: true}));
exports.removeOrder = async (req, res) => { await Order.findByIdAndDelete(req.params.id); res.json({message: 'Deleted'}); };
exports.getCart = async (req, res) => res.json({ message: 'Cart logic dummy' });
exports.addToCart = async (req, res) => res.status(201).json({ message: 'Item added' });
