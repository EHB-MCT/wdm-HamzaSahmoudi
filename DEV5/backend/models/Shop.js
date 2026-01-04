const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  uid: { type: String, required: true, index: true },
  gameId: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

cartItemSchema.index({ uid: 1, gameId: 1 }, { unique: true });

const orderSchema = new mongoose.Schema({
  uid: { type: String, required: true, index: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  items: [{
    gameId: { type: String, required: true },
    title: { type: String, required: true },
    image: { type: String, required: true }
  }],
  steamCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const CartItem = mongoose.model('CartItem', cartItemSchema);
const Order = mongoose.model('Order', orderSchema);

module.exports = { CartItem, Order };