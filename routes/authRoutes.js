const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');
const { protect, validateRegistration, validateLogin } = require('../middlewares/authMiddleware');

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/logout', protect, logout);

module.exports = router;