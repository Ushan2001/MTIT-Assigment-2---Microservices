const Delivery = require('../models/Delivery');

exports.getAllDel = async (req, res) => res.json(await Delivery.find());
exports.getDelById = async (req, res) => res.json(await Delivery.findById(req.params.id));
exports.createDel = async (req, res) => res.status(201).json(await Delivery.create(req.body));
exports.updateStatus = async (req, res) => res.json(await Delivery.findByIdAndUpdate(req.params.id, {status: req.body.status}, {new: true}));

exports.getAllDrivers = async (req, res) => res.json([{id:'d1', name:'Driver 1'}, {id:'d2', name:'Driver 2'}]);
exports.createDriver = async (req, res) => res.status(201).json({id:'d3', name: req.body.name});
exports.updateDriver = async (req, res) => res.json({id: req.params.id, status: req.body.status});
