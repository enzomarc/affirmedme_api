const mongoose = require('mongoose');

// Define the model schema
const schema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Tip', schema);