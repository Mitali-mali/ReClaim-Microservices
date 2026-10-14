const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, itemController.reportItem);
router.get('/', itemController.getItems);
router.get('/:id', itemController.getItemById);
router.put('/:id/status', verifyToken, itemController.updateItemStatus);

module.exports = router;
