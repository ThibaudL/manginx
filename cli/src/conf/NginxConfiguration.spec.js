const sinon = require('sinon');
const mock = require('mock-require');
const fs = require('fs-extra');
const Rx = require('rxjs/Rx');
const {expect} = require('chai');
const CurrentModel = require('../models/CurrentModel');

class MainConfigurationMock {
  constructor(targetDirectory) {

    expect(fs.pathExistsSync(targetDirectory))
      .to
      .be
      .equal(true);
  }

  generate() {
    return Rx.Observable.of('test2');
  }
}

class TemplatesConfigurationMock {
  constructor(useTemplates, targetDirectory) {
    expect(fs.pathExistsSync(targetDirectory))
      .to.be.equal(true);
    expect(useTemplates).to.be.empty;
  }

  generate() {
    return Rx.Observable.of('test1');
  }
}

describe('NginxConfiguration\'s test', () => {
  let sandbox = null;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    mock.stopAll();
  });

  it('should run', (done) => {
    let index = 1;
    sandbox.stub(CurrentModel, 'toArray')
      .returns(Rx.Observable.of([]));
    mock('./MainConfiguration', MainConfigurationMock);
    mock('./TemplatesConfiguration', TemplatesConfigurationMock);
    const TemplatesManager = mock.reRequire('./NginxConfiguration');
    TemplatesManager.run()
      .subscribe(
        (res) => {
          expect(res).to.be.equal(`test${index}`);
          index = index + 1;
        },
        err => done(err),
        () => {
          done();
        }
      );
  });
});