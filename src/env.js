const os = require('os');
const path = require('path');

const fileName = 'manginx.json';
let instance = null;


class Env {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;
  }

  getConfFileRootDir() {
    return os.homedir();
  }

  getDbFilePath() {
    return path.resolve(this.getConfFileRootDir(), fileName);
  }
}

module.exports = new Env();