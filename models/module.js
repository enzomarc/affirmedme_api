const mongoose = require('mongoose');

// Define the model schema
const schema = new mongoose.Schema({
  title: { type: String, required: true },
  steps: [{ type: mongoose.Types.ObjectId, ref: 'ModuleStep' }],
  type: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Module', schema);