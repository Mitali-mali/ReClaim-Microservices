const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, claimController.submitClaim);
router.get('/my-claims', verifyToken, claimController.getMyClaims);
router.get('/', verifyToken, claimController.getAllClaims); 
router.put('/:id/status', verifyToken, claimController.updateClaimStatus);

module.exports = router;
