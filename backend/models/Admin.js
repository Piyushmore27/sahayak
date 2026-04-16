const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  adminId: {
    type: String,
    unique: true,
    default: () => 'ADM-' + Math.floor(10000 + Math.random() * 90000),
  },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  sector: { type: String, default: 'Delhi Sector Alpha' },
  sentinelLevel: { type: Number, default: 1, min: 1, max: 10 },
  avatar: { type: String, default: '' },
  refreshTokens: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

adminSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  return obj;
};

module.exports = mongoose.model('Admin', adminSchema);
