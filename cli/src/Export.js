const path = require('path');
const Rx = require('rxjs/Rx');
const TemplatesModel = require('./models/TemplatesModel');
const DB = require('./db');

class Register {
  constructor(filename) {
    this.templateDir = path.resolve(filename, '..');
  }

  add(obj) {
    const {name, ...others} = obj;
    const {templateDir} = this;
    return TemplatesModel.remove(name)
      .flatMap((result) => {
        if (result) {
          console.log(`replace the old templates '${name}'`);
        }
        return TemplatesModel.add({
          name,
          ...others,
          templateDir
        })
          .map(added => ({
            name,
            added
          }));
      });
  }

  addAll(array) {
    const observables = array.map(o => this.add(o));
    return Rx.Observable.concat(...observables);
  }

  run(...args) {
    if (!args || args.length === 0) {
      throw new Error('You must provide at least one template');
    }
    console.log('*** Add manginx\'s templates : ***');
    this.addAll(args)
      .subscribe(
        ({name, added}) => console.log(`*** Template '${name}' - added : ${(added) ? '🏆' : '🤮'} ***`),
        (err) => {
          console.error(err);
          DB.close();
        },
        () => {
          console.log('*** End ***');
          DB.close();
        }
      );
  }
}

module.exports = {Register};