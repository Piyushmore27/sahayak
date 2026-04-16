const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const volunteerSchema = new mongoose.Schema({
  volunteerId: {
    type: String,
    unique: true,
    default: () => 'VOL-' + Math.floor(10000 + Math.random() * 90000),
  },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  occupation: {
    type: String,
    enum: ['Doctor', 'Nurse', 'Paramedic', 'Firefighter', 'Police', 'Rescue Diver', 'Logistics', 'Field Coordinator', 'Community Anchor', 'Other'],
    required: true,
  },
  aadharNumber: { type: String },
  address: { type: String },
  avatar: { type: String, default: '' },
  district: { type: String, default: '' },
  sector: { type: String, default: '' },
  emergencyRole: {
    type: String,
    enum: ['Medical Lead', 'Logistics', 'Communications', 'Support', 'Coordinator', 'Field Agent'],
    default: 'Field Agent',
  },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  appreciationPoints: { type: Number, default: 0 },
  missionsCompleted: { type: Number, default: 0 },
  badge: {
    type: String,
    enum: ['', 'Lifesaver Elite', 'Rapid Responder', 'First Contact', 'Crisis Expert', 'Community Anchor', 'Lifesaver'],
    default: '',
  },
  isOnline: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'active', 'suspended'], default: 'pending' },
  refreshTokens: [{ type: String }],
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  skills: [{ type: String }],
}, { timestamps: true });

volunteerSchema.index({ location: '2dsphere' });

volunteerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

volunteerSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

volunteerSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  delete obj.aadharNumber;
  return obj;
};

module.exports = mongoose.model('Volunteer', volunteerSchema);
