const Rx = require('rxjs/Rx');
const fkill = require('fkill');

class Stop {
  constructor(killer) {
    this.killer = killer || fkill;
  }
  // eslint-disable-next-line class-methods-use-this
  run() {
    return Rx.Observable.fromPromise(this.killer('nginx'))
      .map(() => true);
  }
}

module.exports = Stop;