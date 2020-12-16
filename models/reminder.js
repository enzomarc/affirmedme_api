const mongoose = require('mongoose');

// Define the model schema
const schema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  group: { type: String, default: 'all' },
  at: { type: Date, required: false },
  done: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Reminder', schema);