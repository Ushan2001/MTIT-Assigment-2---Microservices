const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  customerId: String,
  restaurantId: String,
  items: [{ menuItemId: String, qty: Number, price: Number }],
  totalAmount: Number,
  status: { type: String, default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Order', orderSchema);
