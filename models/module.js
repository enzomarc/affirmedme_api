const mongoose = require('mongoose');

// Define the model schema
const schema = new mongoose.Schema({
  title: { type: String, required: true },
  steps: [{
    title: { type: String, required: true },
    goals: [{
      title: String,
      tips: [{ type: String }],
    }],
  }],
  type: { type: String, required: true },
  instruction: String,
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Module', schema);