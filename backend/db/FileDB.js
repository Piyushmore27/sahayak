const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

class FileDB {
  constructor(collection) {
    this.filePath = path.join(DATA_DIR, `${collection}.json`);
    this.ensureFileExists();
  }

  ensureFileExists() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  read() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data || '[]');
    } catch (error) {
      console.error(`Error reading ${this.filePath}:`, error);
      return [];
    }
  }

  write(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error writing to ${this.filePath}:`, error);
    }
  }

  findAll() {
    return this.read();
  }

  findOne(query) {
    const data = this.read();
    return data.find(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  }

  findById(id) {
    const data = this.read();
    return data.find(item => item.id === id || item._id === id);
  }

  create(newItem) {
    const data = this.read();
    const itemWithId = { 
      ...newItem, 
      _id: newItem._id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.push(itemWithId);
    this.write(data);
    return itemWithId;
  }

  updateById(id, updates) {
    const data = this.read();
    const index = data.findIndex(item => item.id === id || item._id === id);
    if (index !== -1) {
      data[index] = { 
        ...data[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      this.write(data);
      return data[index];
    }
    return null;
  }

  deleteById(id) {
    let data = this.read();
    const initialLength = data.length;
    data = data.filter(item => item.id !== id && item._id !== id);
    if (data.length !== initialLength) {
      this.write(data);
      return true;
    }
    return false;
  }
}

module.exports = FileDB;
