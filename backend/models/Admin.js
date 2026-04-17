const FileDB = require('../db/FileDB');
const bcrypt = require('bcryptjs');

const db = new FileDB('admins');

class AdminModel {
  static createQuery(data) {
    if (!data) return {
      select: function() { return this; },
      then: (resolve) => resolve(null)
    };

    const doc = {
      ...data,
      comparePassword: async function(candidatePassword) {
        if (!this.password) return false;
        return bcrypt.compare(candidatePassword, this.password);
      },
      save: async function() {
        const { comparePassword, save, select, then, ...dataToSave } = this;
        db.updateById(this._id || data._id, dataToSave);
        return this;
      }
    };

    const query = {
      ...doc,
      select: function() { return this; },
      then: (resolve) => resolve(doc)
    };
    
    return query;
  }

  static findOne(query) {
    const admin = db.findOne(query);
    return this.createQuery(admin);
  }

  static findById(id) {
    const admin = db.findById(id);
    return this.createQuery(admin);
  }

  static async create(data) {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const newAdmin = {
      ...data,
      password: hashedPassword,
      adminId: data.adminId || 'ADM-' + Math.floor(10000 + Math.random() * 90000),
      sector: data.sector || 'Delhi Sector Alpha',
      sentinelLevel: 1,
      isActive: true,
      refreshTokens: []
    };
    const created = db.create(newAdmin);
    return this.createQuery(created);
  }
}

module.exports = AdminModel;
