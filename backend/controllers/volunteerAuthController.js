const jwt = require('jsonwebtoken');
const Volunteer = require('../models/Volunteer');

const generateTokens = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '15m' });
  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' });
  return { accessToken, refreshToken };
};

// POST /api/volunteer/auth/register
exports.register = async (req, res) => {
  try {
    const { fullName, email, phone, password, occupation, aadharNumber, address } = req.body;
    const existing = await Volunteer.findOne({ $or: [{ email }, { phone }] });
    if (existing) return res.status(400).json({ success: false, message: 'Email or phone already registered' });

    const volunteer = await Volunteer.create({ fullName, email, phone, password, occupation, aadharNumber, address });
    res.status(201).json({ success: true, message: 'Registration submitted. Awaiting admin approval.', data: { volunteer } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/volunteer/auth/login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const isPhone = /^\+?\d/.test(username);
    const query = isPhone ? { phone: username } : { email: username.toLowerCase() };
    const volunteer = await Volunteer.findOne(query).select('+password +refreshTokens');

    if (!volunteer || !(await volunteer.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    if (volunteer.status === 'pending') {
      return res.status(403).json({ success: false, message: 'Your account is pending approval from an administrator.' });
    }
    if (volunteer.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Account suspended. Contact support.' });
    }

    const { accessToken, refreshToken } = generateTokens(volunteer._id);
    volunteer.refreshTokens.push(refreshToken);
    volunteer.isOnline = true;
    await volunteer.save();

    res.json({ success: true, data: { volunteer, accessToken, refreshToken } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/volunteer/auth/refresh
exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ success: false, message: 'No refresh token' });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const volunteer = await Volunteer.findById(decoded.id).select('+refreshTokens');
    if (!volunteer || !volunteer.refreshTokens.includes(refreshToken)) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(volunteer._id);
    volunteer.refreshTokens = volunteer.refreshTokens.filter(t => t !== refreshToken);
    volunteer.refreshTokens.push(newRefreshToken);
    await volunteer.save();

    res.json({ success: true, data: { accessToken, refreshToken: newRefreshToken } });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};

// POST /api/volunteer/auth/logout
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const volunteer = await Volunteer.findById(req.user._id).select('+refreshTokens');
    volunteer.refreshTokens = volunteer.refreshTokens.filter(t => t !== refreshToken);
    volunteer.isOnline = false;
    await volunteer.save();
    res.json({ success: true, message: 'Logged out' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/volunteer/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, data: req.user });
};
