const mongoose = require('mongoose');

// Define the model schema
const schema = new mongoose.Schema({
  title: { type: String, required: true },
  items: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('ModuleStep', schema);