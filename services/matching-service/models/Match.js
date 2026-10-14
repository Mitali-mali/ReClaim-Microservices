const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  lostItemId: { type: String, required: true },
  foundItemId: { type: String, required: true },
  score: { type: Number, required: true },
  reasons: [{ type: String }],
  status: { type: String, enum: ['Pending', 'Reviewed'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
