const Rx = require('rxjs/Rx');
const childProcess = require('child_process');
const DB = require('../db');
const TemplatesManager = require('../conf/NginxConfiguration');
const {createCategoryLogger} = require('../Logger');

const logger = createCategoryLogger('nginx\'s logs -> ');

function logOutput(buf) {
  const lines = buf.toString()
    .split('\n');
  lines.forEach((line) => {
    if (line.length) {
      if (line.match(/\[debug\]/)) {
        logger.info('d:', line);
      } else {
        logger.info(line);
      }
    }
  });
}

class Start {
  static testIfExist(commandName) {
    return Rx.Observable.create((observer) => {
      const nginx = childProcess.spawn(commandName, ['-v']);
      nginx.stdout.on('data', logOutput);
      nginx.stderr.on('data', logOutput);
      nginx.stderr.on('data', (buff) => {
        if (buff.toString()
          .match(/nginx version/)) {
          observer.next(commandName);
          observer.complete();
        } else {
          observer.error(new Error('No nginx global command found.'));
          observer.complete();
        }
      });
    });
  }

  static launch(command, confFile) {
    return Rx.Observable.create((observer) => {
      let started = false;
      const nginx = childProcess.spawn(command, ['-c', confFile]);
      nginx.stdout.on('data', logOutput);
      nginx.stderr.on('data', logOutput);
      nginx.stderr.on('data', (buff) => {
        const str = buff.toString();
        if (!started && str.match(/start worker process \d+/)) {
          started = true;
          observer.next(true);
          observer.complete();
        }
      });
    });
  }

  static start(nginxPath) {
    // if current install not defined, try to test if nginx exist in the PATH.
    const commandName = nginxPath || 'nginx';
    if (!nginxPath) {
      logger.info('No Installed nginx found. Used global installation instead.');
    }
    return Start.testIfExist(commandName)
      .flatMap(c => TemplatesManager.run()
        .flatMap(confFile => Start.launch(c, confFile)));
  }

  // eslint-disable-next-line class-methods-use-this
  run() {
    return DB.initialize()
      .flatMap((db) => {
        const conf = db.configuration().state();
        return Start.start(conf.installedPath);
      });
  }
}

module.exports = Start;