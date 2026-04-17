const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateTokens = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '15m' });
  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' });
  return { accessToken, refreshToken };
};

// POST /api/admin/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, sector } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    const admin = await Admin.create({ name, email, password, sector });
    const { accessToken, refreshToken } = generateTokens(admin._id);
    admin.refreshTokens.push(refreshToken);
    await admin.save();

    res.status(201).json({ success: true, data: { admin, accessToken, refreshToken } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/admin/auth/login
exports.login = async (req, res) => {
  try {
    const { email, adminId, password } = req.body;
    console.log(`Login attempt for: ${email || adminId}`);
    
    const query = email ? { email } : { adminId };
    const admin = await Admin.findOne(query).select('+password +refreshTokens');
    
    if (!admin) {
      console.log('Admin not found in database');
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    console.log(`Password match: ${isMatch}`);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    if (!admin.isActive) {
      console.log('Admin account is inactive');
      return res.status(403).json({ success: false, message: 'Account deactivated' });
    }

    const { accessToken, refreshToken } = generateTokens(admin._id);
    admin.refreshTokens = admin.refreshTokens || [];
    admin.refreshTokens.push(refreshToken);
    await admin.save();

    console.log('Login successful');
    res.json({ success: true, data: { admin, accessToken, refreshToken } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/admin/auth/refresh
exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ success: false, message: 'No refresh token' });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const admin = await Admin.findById(decoded.id).select('+refreshTokens');
    if (!admin || !admin.refreshTokens.includes(refreshToken)) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(admin._id);
    admin.refreshTokens = admin.refreshTokens.filter(t => t !== refreshToken);
    admin.refreshTokens.push(newRefreshToken);
    await admin.save();

    res.json({ success: true, data: { accessToken, refreshToken: newRefreshToken } });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};

// POST /api/admin/auth/logout
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const admin = await Admin.findById(req.user._id).select('+refreshTokens');
    admin.refreshTokens = admin.refreshTokens.filter(t => t !== refreshToken);
    await admin.save();
    res.json({ success: true, message: 'Logged out' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, data: req.user });
};
