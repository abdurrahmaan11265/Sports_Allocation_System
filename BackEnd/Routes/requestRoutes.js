const express = require('express');
const { sendRequest, getRequests, updateRequestStatus, returnItem } = require('../controllers/requestController');
const { protect, admin, student } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, student, sendRequest).get(protect, getRequests);
router.route('/:id').put(protect, admin, updateRequestStatus);
// router.route('/:id/return').post(protect, student, returnItem);

module.exports = router;
