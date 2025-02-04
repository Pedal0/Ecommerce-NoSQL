// backend/models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price: Number
  }],
  total: Number,
  paymentDetails: {
    method: String,
    status: { type: String, enum: ['en attente', 'payé', 'échoué'], default: 'en attente' }
  },
  status: { type: String, enum: ['confirmée', 'expédiée', 'livrée', 'annulée'], default: 'confirmée' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
