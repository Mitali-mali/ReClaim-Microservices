const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  itemId: { type: String, required: true }, // The found item being claimed
  claimerId: { type: String, required: true }, // The user claiming the item
  proofDescription: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'RESOLVED'], default: 'PENDING' }
}, { timestamps: true });

module.exports = mongoose.model('Claim', claimSchema);
