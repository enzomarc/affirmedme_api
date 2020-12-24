const mongoose = require('mongoose');

// Define the model schema
const schema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: false },
  email: { type: String, required: true },
  phone: { type: String, required: false },
  type: { type: String, default: 'contact' },
  notes: [String],
  user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Contact', schema);