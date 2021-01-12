const mongoose = require('mongoose');

// Define the model schema
const schema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  activity: { type: String, required: true },
  categories: [{
    title: { type: String, required: true },
    items: [{ type: String, required: true }],
  }]
}, { timestamps: true });

module.exports = mongoose.model('Planning', schema);