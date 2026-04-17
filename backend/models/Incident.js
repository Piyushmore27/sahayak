const FileDB = require('../db/FileDB');

const db = new FileDB('incidents');

class IncidentModel {
  static createQuery(data) {
    if (!data) return {
      then: (resolve) => resolve(null)
    };

    const doc = {
      ...data,
      save: async function() {
        const { save, then, ...dataToSave } = this;
        db.updateById(this._id || data._id, dataToSave);
        return this;
      }
    };

    const query = {
      ...doc,
      then: (resolve) => resolve(doc)
    };
    
    return query;
  }

  static find(query = {}) {
    const all = db.findAll();
    const results = all.filter(item => {
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

  static findById(id) {
    const incident = db.findById(id);
    return this.createQuery(incident);
  }

  static async create(data) {
    const newIncident = {
      ...data,
      incidentId: 'INC-' + Date.now(),
      status: data.status || 'active',
      priority: data.priority || 'Monitor',
      respondersCount: 0,
      assignedVolunteers: data.assignedVolunteers || [],
      reportedBy: data.reportedBy || 'System'
    };
    const created = db.create(newIncident);
    return this.createQuery(created);
  }

  static findByIdAndDelete(id) {
    const deleted = db.deleteById(id);
    const wrapper = {
      then: (resolve) => resolve(deleted)
    };
    return wrapper;
  }

  static findByIdAndUpdate(id, updates) {
    const updated = db.updateById(id, updates);
    return this.createQuery(updated);
  }
}

module.exports = IncidentModel;
