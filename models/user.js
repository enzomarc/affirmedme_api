const mongoose = require('mongoose');

// Define the model schema
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  active: { type: Boolean, default: true },
  premium: { type: Boolean, default: false },
  card: {
    card_id: String,
    number: String,
    exp: String,
    cvc: String
  },
}, { timestamps: true });

module.exports = mongoose.model('User', schema);