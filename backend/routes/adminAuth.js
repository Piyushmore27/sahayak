const router = require('express').Router();
const { register, login, refresh, logout, getMe } = require('../controllers/adminAuthController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', protect('admin'), logout);
router.get('/me', protect('admin'), getMe);

module.exports = router;
