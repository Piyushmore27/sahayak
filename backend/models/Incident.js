const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  incidentId: {
    type: String,
    unique: true,
    default: () => 'INC-' + Date.now(),
  },
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ['Traffic Accident', 'Wildfire Alert', 'Urban Infrastructure', 'Medical Emergency', 'Natural Disaster', 'Security Threat', 'Other'],
    required: true,
  },
  priority: {
    type: String,
    enum: ['Low', 'Monitor', 'High Priority', 'Urgent', 'Critical'],
    default: 'Monitor',
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'escalated', 'pending'],
    default: 'active',
  },
  description: { type: String },
  location: {
    address: { type: String },
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
  },
  assignedVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' }],
  respondersCount: { type: Number, default: 0 },
  image: { type: String, default: '' },
  reportedBy: { type: String, default: 'System' },
  resolvedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Incident', incidentSchema);
