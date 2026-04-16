const express = require('express');
const router = express.Router();
const { updateProfile, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/profile').put(protect, updateProfile);
router.route('/:id').get(getUserProfile);

module.exports = router;
