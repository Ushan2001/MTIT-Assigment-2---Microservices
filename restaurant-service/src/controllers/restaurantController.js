const Restaurant = require('../models/Restaurant');
exports.getAll = async (req, res) => res.json(await Restaurant.find());
exports.getById = async (req, res) => res.json(await Restaurant.findById(req.params.id));
exports.create = async (req, res) => res.status(201).json(await Restaurant.create(req.body));
exports.update = async (req, res) => res.json(await Restaurant.findByIdAndUpdate(req.params.id, req.body, {new: true}));
exports.remove = async (req, res) => { await Restaurant.findByIdAndDelete(req.params.id); res.json({message: 'Deleted'}); };
exports.getMenu = async (req, res) => { const r = await Restaurant.findById(req.params.id); res.json(r ? r.menu : []); };
exports.addMenuItem = async (req, res) => {
    const r = await Restaurant.findById(req.params.id);
    if(r) { r.menu.push(req.body); await r.save(); res.json(r); } else { res.status(404).json({err: 'Not found'}); }
};
