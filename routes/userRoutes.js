const expres = require('express');
const router = expres.Router();
const { validateProfileUpdate, validatePasswordUpdate } = require('../middlewares/validation');
const {
    getProfile,
    updateProfile,
    updatePassword,
    deleteAccount
} = require('../controllers/userController');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, validateProfileUpdate, updateProfile);
router.put('/password', protect, validatePasswordUpdate, updatePassword);
router.delete('/account', protect, deleteAccount);

module.exports = router;