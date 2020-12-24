const mongoose = require('mongoose');

// Define the model schema
const schema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  meals: [String],
}, { timestamps: true });

module.exports = mongoose.model('Meal', schema);