const router = require('express').Router();
const { register, login, refresh, logout, getMe } = require('../controllers/volunteerAuthController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', protect('volunteer'), logout);
router.get('/me', protect('volunteer'), getMe);

module.exports = router;
