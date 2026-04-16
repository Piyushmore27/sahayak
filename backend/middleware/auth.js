const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Volunteer = require('../models/Volunteer');

const protect = (role) => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (role === 'admin') {
      const admin = await Admin.findById(decoded.id);
      if (!admin || !admin.isActive) {
        return res.status(401).json({ success: false, message: 'Admin not found or inactive' });
      }
      req.user = admin;
      req.role = 'admin';
    } else if (role === 'volunteer') {
      const volunteer = await Volunteer.findById(decoded.id);
      if (!volunteer || volunteer.status === 'suspended') {
        return res.status(401).json({ success: false, message: 'Volunteer not found or suspended' });
      }
      req.user = volunteer;
      req.role = 'volunteer';
    } else {
      // Try both
      let user = await Admin.findById(decoded.id);
      if (user) {
        req.role = 'admin';
      } else {
        user = await Volunteer.findById(decoded.id);
        req.role = 'volunteer';
      }
      if (!user) return res.status(401).json({ success: false, message: 'User not found' });
      req.user = user;
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = { protect };
