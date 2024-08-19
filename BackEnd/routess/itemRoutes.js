const express = require('express');
const { getItems, addItem, updateItem, deleteItem } = require('../controllers/itemController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getItems).post(protect, admin, addItem);
router.route('/:id').put(protect, admin, updateItem).delete(protect, admin, deleteItem);

module.exports = router;
