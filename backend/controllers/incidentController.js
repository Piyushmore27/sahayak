const Incident = require('../models/Incident');

// GET /api/incidents
exports.getIncidents = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const total = await Incident.countDocuments(query);
    const incidents = await Incident.find(query)
      .populate('assignedVolunteers', 'fullName avatar emergencyRole')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: { incidents, total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/incidents
exports.createIncident = async (req, res) => {
  try {
    const incident = await Incident.create(req.body);
    res.status(201).json({ success: true, data: incident });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/incidents/:id
exports.updateIncident = async (req, res) => {
  try {
    const incident = await Incident.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!incident) return res.status(404).json({ success: false, message: 'Incident not found' });
    res.json({ success: true, data: incident });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/incidents/:id/assign
exports.assignVolunteers = async (req, res) => {
  try {
    const { volunteerIds } = req.body;
    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { assignedVolunteers: { $each: volunteerIds } }, respondersCount: volunteerIds.length },
      { new: true }
    ).populate('assignedVolunteers', 'fullName avatar emergencyRole');
    res.json({ success: true, data: incident });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/incidents/:id
exports.deleteIncident = async (req, res) => {
  try {
    await Incident.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Incident deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
