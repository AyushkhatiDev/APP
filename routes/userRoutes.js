const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const {
    validateProfileUpdate,
    validatePasswordUpdate
} = require('../middlewares/validation');
const {
    getProfile,
    updateProfile,
    updatePassword,
    deleteAccount
} = require('../controllers/userController');

// Protected routes
router.use(protect);

router.route('/profile')
    .get(getProfile)
    .put(validateProfileUpdate, updateProfile);

router.put('/password', validatePasswordUpdate, updatePassword);
router.delete('/', deleteAccount);

module.exports = router;