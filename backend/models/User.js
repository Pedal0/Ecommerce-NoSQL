// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: { type: String, enum: ['admin', 'vendeur', 'client', 'gestionnaire', 'analyste'], default: 'client' }
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', UserSchema);
