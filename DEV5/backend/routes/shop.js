const express = require('express');
const router = express.Router();
const { CartItem, Order } = require('../models/Shop');
const User = require('../models/User');
const Account = require('../models/Account');

router.get('/cart', async (req, res) => {
  try {
    const { uid } = req.query;
    if (!uid) {
      return res.status(400).json({ error: 'uid required' });
    }

    const items = await CartItem.find({ uid }).sort({ createdAt: -1 });
    res.json({
      uid,
      count: items.length,
      items
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/cart/add', async (req, res) => {
  try {
    const { uid, gameId, title, image } = req.body;
    if (!uid || !gameId || !title || !image) {
      return res.status(400).json({ error: 'missing fields' });
    }

    const existing = await CartItem.findOne({ uid, gameId });
    if (existing) {
      return res.status(409).json({ error: 'item already in cart' });
    }

    const item = new CartItem({ uid, gameId, title, image });
    await item.save();
    res.status(201).json({ message: 'added to cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/cart/remove/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { uid } = req.body;
    if (!uid || !gameId) {
      return res.status(400).json({ error: 'uid and gameId required' });
    }

    const result = await CartItem.deleteOne({ uid, gameId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'item not found' });
    }
    res.json({ message: 'item removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/cart/clear', async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) {
      return res.status(400).json({ error: 'uid required' });
    }

    await CartItem.deleteMany({ uid });
    res.json({ message: 'cart cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/orders/checkout', async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) {
      return res.status(400).json({ error: 'uid required' });
    }

    const cartItems = await CartItem.find({ uid });
    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'cart is empty' });
    }

    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }

    let email = user.email;
    if (!email && user.accountId) {
      const account = await Account.findById(user.accountId);
      if (account) {
        email = account.email;
      }
    }

    if (!email) {
      return res.status(400).json({ error: 'user email not found' });
    }

    const steamCode = generateSteamCode();

    const order = new Order({
      uid,
      email,
      name: user.name,
      items: cartItems.map(item => ({
        gameId: item.gameId,
        title: item.title,
        image: item.image
      })),
      steamCode
    });

    await order.save();

    await CartItem.deleteMany({ uid });

    res.json({
      message: 'order placed successfully',
      steamCode,
      orderId: order._id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const { uid } = req.query;
    if (!uid) {
      return res.status(400).json({ error: 'uid required' });
    }

    const orders = await Order.find({ uid }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/admin/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function generateSteamCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    if (i > 0) code += '-';
    for (let j = 0; j < 4; j++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  return code;
}

module.exports = router;