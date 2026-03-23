const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  orderId: String, driverId: String, pickupLocation: String, dropLocation: String,
  status: { type: String, default: 'ASSIGNED' }, estimatedTime: String
});
module.exports = mongoose.model('Delivery', schema);
