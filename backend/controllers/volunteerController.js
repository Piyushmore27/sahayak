const Volunteer = require('../models/Volunteer');

// GET /api/admin/volunteers
exports.getAllVolunteers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, district, status } = req.query;
    const query = {};
    if (search) query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { emergencyRole: { $regex: search, $options: 'i' } },
    ];
    if (district) query.district = district;
    if (status) query.status = status;

    const total = await Volunteer.countDocuments(query);
    const volunteers = await Volunteer.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: { volunteers, total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/volunteers/:id
exports.getVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) return res.status(404).json({ success: false, message: 'Volunteer not found' });
    res.json({ success: true, data: volunteer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/admin/volunteers/:id/approve
exports.approveVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status: 'active', isApproved: true, isVerified: true },
      { new: true }
    );
    if (!volunteer) return res.status(404).json({ success: false, message: 'Volunteer not found' });
    res.json({ success: true, message: 'Volunteer approved', data: volunteer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/admin/volunteers/:id/reject
exports.rejectVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status: 'suspended', isApproved: false },
      { new: true }
    );
    if (!volunteer) return res.status(404).json({ success: false, message: 'Volunteer not found' });
    res.json({ success: true, message: 'Volunteer rejected', data: volunteer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/volunteers/pending
exports.getPendingVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json({ success: true, data: volunteers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/volunteers/rankings
exports.getRankings = async (req, res) => {
  try {
    const { period } = req.query; // 'month' or 'all'
    const volunteers = await Volunteer.find({ status: 'active' })
      .sort({ appreciationPoints: -1 })
      .limit(50);
    res.json({ success: true, data: volunteers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/dashboard/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const activeVolunteers = await Volunteer.countDocuments({ status: 'active' });
    const pendingVolunteers = await Volunteer.countDocuments({ status: 'pending' });
    const onlineVolunteers = await Volunteer.countDocuments({ isOnline: true });

    res.json({
      success: true,
      data: {
        activeVolunteers,
        pendingVolunteers,
        onlineVolunteers,
        pendingAlerts: 42, // would come from alerts model
        safeZones: 15,
        systemHealth: 94,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
