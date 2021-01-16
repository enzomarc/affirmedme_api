const mongoose = require('mongoose');

// Define the model schema
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  industry: { type: String, required: false },
  hobby: { type: String, required: false },
  email: { type: String, required: true },
  phone: { type: String, required: false },
  birthday: { type: Date, required: false },
  last_contact: { type: Date, required: false },
  next_contact: { type: Date, required: false },
  remind_at: { type: Date, required: false },
  notes: [String],
  user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Contact', schema);