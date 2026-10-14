const Claim = require('../models/Claim');
const axios = require('axios');

const ITEM_SERVICE_URL = process.env.ITEM_SERVICE_URL || 'http://localhost:5002';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5005';

exports.submitClaim = async (req, res) => {
  try {
    const { itemId, proofDescription } = req.body;
    
    // Check if item exists
    let itemResponse;
    try {
      itemResponse = await axios.get(`${ITEM_SERVICE_URL}/api/items/${itemId}`);
    } catch (err) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const newClaim = new Claim({
      itemId,
      claimerId: req.user.id,
      proofDescription
    });

    await newClaim.save();

    // Trigger notification (fire and forget)
    axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications`, {
      userId: itemResponse.data.reporterId, // notify the person who reported the item
      title: 'New Claim Received',
      message: `Someone has submitted a claim for your item.`
    }).catch(err => console.error('Failed to send notification', err.message));

    res.status(201).json({ message: 'Claim submitted successfully', claim: newClaim });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ claimerId: req.user.id }).sort({ createdAt: -1 });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateClaimStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const claim = await Claim.findById(req.params.id);
    
    if (!claim) return res.status(404).json({ error: 'Claim not found' });
    
    claim.status = status;
    await claim.save();

    // Trigger notification
    axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications`, {
      userId: claim.claimerId, // notify the claimer
      title: 'Claim Status Updated',
      message: `Your claim status is now: ${status}`
    }).catch(err => console.error('Failed to send notification', err.message));
    
    res.json({ message: 'Claim status updated', claim });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find().sort({ createdAt: -1 });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
