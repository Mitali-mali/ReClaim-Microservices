const Match = require('../models/Match');
const axios = require('axios');

const ITEM_SERVICE_URL = process.env.ITEM_SERVICE_URL || 'http://localhost:5002';

exports.getMatches = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    // 1. Fetch the target item from Item Service
    let targetItemResponse;
    try {
      targetItemResponse = await axios.get(`${ITEM_SERVICE_URL}/api/items/${itemId}`);
    } catch (err) {
      return res.status(404).json({ error: 'Item not found in Item Service' });
    }
    
    const targetItem = targetItemResponse.data;
    const targetType = targetItem.type; // 'Lost' or 'Found'
    const oppositeType = targetType === 'Lost' ? 'Found' : 'Lost';

    // 2. Fetch all opposite items to compare against
    const oppositeItemsResponse = await axios.get(`${ITEM_SERVICE_URL}/api/items?type=${oppositeType}&status=Active`);
    const candidates = oppositeItemsResponse.data;

    let newMatches = [];

    // 3. Rule-Based Matching Algorithm
    for (const candidate of candidates) {
      let score = 0;
      let reasons = [];

      // Category Match (40 pts)
      if (candidate.category === targetItem.category) {
        score += 40;
        reasons.push('Category Match: Yes');
      } else {
        reasons.push('Category Match: No');
      }

      // Location Match (Basic substring inclusion) (20 pts)
      if (candidate.location && targetItem.location) {
        if (candidate.location.toLowerCase().includes(targetItem.location.toLowerCase()) || 
            targetItem.location.toLowerCase().includes(candidate.location.toLowerCase())) {
          score += 20;
          reasons.push('Location Match: Yes');
        } else {
          reasons.push('Location Match: No');
        }
      }

      // Color Match (15 pts)
      if (candidate.color && targetItem.color && candidate.color.toLowerCase() === targetItem.color.toLowerCase()) {
        score += 15;
        reasons.push('Color Match: Yes');
      }

      // Brand Match (15 pts)
      if (candidate.brand && targetItem.brand && candidate.brand.toLowerCase() === targetItem.brand.toLowerCase()) {
        score += 15;
        reasons.push('Brand Match: Yes');
      }

      // Date Proximity (10 pts) - Within 3 days
      const date1 = new Date(candidate.date);
      const date2 = new Date(targetItem.date);
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      if (diffDays <= 3) {
        score += 10;
        reasons.push('Date Proximity: Within 3 days');
      }

      // If score is reasonable (e.g., >= 40), save it
      if (score >= 40) {
        const lostItemId = targetType === 'Lost' ? targetItem._id : candidate._id;
        const foundItemId = targetType === 'Found' ? targetItem._id : candidate._id;

        // Check if match already exists
        let existingMatch = await Match.findOne({ lostItemId, foundItemId });
        
        if (existingMatch) {
          existingMatch.score = score;
          existingMatch.reasons = reasons;
          await existingMatch.save();
          newMatches.push(existingMatch);
        } else {
          const newMatch = new Match({
            lostItemId,
            foundItemId,
            score,
            reasons
          });
          await newMatch.save();
          newMatches.push(newMatch);
        }
      }
    }

    res.json(newMatches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
