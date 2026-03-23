const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: String, email: String, passwordHash: String, phone: String, address: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Customer', schema);
