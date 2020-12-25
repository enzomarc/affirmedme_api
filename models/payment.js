const mongoose = require('mongoose');

// Define the model schema
const schema = new mongoose.Schema({
  payment_id: { type: String, unique: true },
  card_id: String,
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'init' },
}, { timestamps: true });

module.exports = mongoose.model('Payment', schema);