const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

router.get('/:itemId', matchController.getMatches);

module.exports = router;
