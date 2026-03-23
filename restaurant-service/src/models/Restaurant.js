const mongoose = require('mongoose');
const restaurantSchema = new mongoose.Schema({
  name: String,
  address: String,
  cuisine: String,
  rating: Number,
  menu: [{
    itemName: String,
    price: Number,
    description: String,
    available: Boolean
  }]
});
module.exports = mongoose.model('Restaurant', restaurantSchema);
