// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate, checkRole } = require('../middleware/auth');
const Product = require('../models/Product');

// Création d'un produit (vendeur ou admin)
router.post('/', authenticate, checkRole(['vendeur', 'admin']), async (req, res) => {
  try {
    const product = new Product({ ...req.body, seller: req.user.id });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Récupérer tous les produits
router.get('/', authenticate, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Récupérer un produit par son ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'username email');
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mise à jour d'un produit
router.put('/:id', authenticate, checkRole(['vendeur', 'admin']), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Suppression d'un produit
router.delete('/:id', authenticate, checkRole(['vendeur', 'admin']), async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produit supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/products', authenticate, checkRole(['vendeur', 'admin']), async (req, res) => {
  // Création de produit - accessible uniquement aux vendeurs et admins
});



module.exports = router;
