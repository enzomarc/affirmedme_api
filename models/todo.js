const mongoose = require('mongoose');

// Define the model schema
const schema = new mongoose.Schema({
  author: { type: mongoose.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  done: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Todo', schema);