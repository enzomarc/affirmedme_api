const mongoose = require('mongoose');

// Define the model schema
const schema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  label: { type: String, required: true },
  group: { type: String, required: true },
  at: { type: Date, required: false },
}, { timestamps: true });

module.exports = mongoose.model('Date', schema);