// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate, checkRole } = require('../middleware/auth');
const Order = require('../models/Order');

// Création d'une commande (client)
router.post('/', authenticate, checkRole(['client']), async (req, res) => {
  try {
    const { items, paymentDetails } = req.body;
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const order = new Order({ user: req.user.id, items, total, paymentDetails });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Récupération des commandes
router.get('/', authenticate, async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'client') {
      orders = await Order.find({ user: req.user.id }).populate('items.product', 'name price');
    } else if (req.user.role === 'vendeur') {
      orders = await Order.find().populate('items.product', 'name price seller');
      orders = orders.filter(order => order.items.some(item => item.product.seller.toString() === req.user.id));
    } else {
      orders = await Order.find().populate('items.product', 'name price');
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mise à jour du statut d'une commande (gestionnaire/admin)
router.put('/:id/status', authenticate, checkRole(['gestionnaire', 'admin']), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Suppression d'une commande (admin)
router.delete('/:id', authenticate, checkRole(['admin']), async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Commande supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/orders', authenticate, checkRole(['client', 'admin']), async (req, res) => {
  // Création de commande - accessible uniquement aux clients et admins
});

module.exports = router;
