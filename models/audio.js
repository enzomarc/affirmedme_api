const mongoose = require('mongoose');

// Define the model schema
const schema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  image: String,
  path: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Audio', schema);