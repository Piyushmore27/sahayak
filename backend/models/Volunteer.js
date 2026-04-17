const FileDB = require('../db/FileDB');
const bcrypt = require('bcryptjs');

const db = new FileDB('volunteers');

class VolunteerModel {
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
    // Controller sends { $or: [{ email: val }, { phone: val }] } sometimes
    // But our FileDB doesn't support $or. Let's add basic support here if needed.
    let volunteer;
    if (query.$or) {
      const all = db.findAll();
      volunteer = all.find(item => {
        return query.$or.some(q => {
          return Object.keys(q).every(key => item[key] === q[key]);
        });
      });
    } else {
      volunteer = db.findOne(query);
    }
    return this.createQuery(volunteer);
  }

  static findById(id) {
    const volunteer = db.findById(id);
    return this.createQuery(volunteer);
  }

  static find(query = {}) {
    const all = db.findAll();
    let results = all.filter(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
    
    const wrapper = {
      results,
      sort: function() { return this; },
      select: function() { return this; },
      then: (resolve) => resolve(results)
    };
    return wrapper;
  }

  static async create(data) {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const newVolunteer = {
      ...data,
      password: hashedPassword,
      volunteerId: data.volunteerId || 'VOL-' + Math.floor(10000 + Math.random() * 90000),
      rating: 0,
      appreciationPoints: 0,
      missionsCompleted: 0,
      isOnline: false,
      isVerified: false,
      isApproved: false,
      status: 'pending',
      refreshTokens: [],
      location: { type: 'Point', coordinates: [0, 0] },
      skills: data.skills || []
    };
    const created = db.create(newVolunteer);
    return this.createQuery(created);
  }
}

module.exports = VolunteerModel;
