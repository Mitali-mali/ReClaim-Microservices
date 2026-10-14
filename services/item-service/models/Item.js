const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  reporterId: { type: String, required: true }, // References User ID from Auth Service
  type: { type: String, enum: ['Lost', 'Found'], required: true },
  category: { type: String, required: true }, // e.g., Electronics, Documents, Keys
  name: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  color: { type: String },
  brand: { type: String },
  status: { type: String, enum: ['Active', 'Resolved'], default: 'Active' },
  imageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
