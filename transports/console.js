'use strict';

const Transport = require('./transport');
const debug = require('debug')('timtam-logger');

class Console extends Transport {
  constructor(options) {
    super(options);
    debug('options:%j', options);
    this.originalStdout = process.stdout;
    this.originalStderr = process.stderr;
  }
  /* eslint class-methods-use-this:0 */
  get name() {
    return 'console';
  }
  get stdout() {
    return this.originalStdout;
  }
  get stderr() {
    return this.originalStderr;
  }
  set stdout(_stdout) {
    /* istanbul ignore else */
    if (_stdout) {
      this.originalStdout = _stdout;
    }
  }
  set stderr(_stderr) {
    /* istanbul ignore else */
    if (_stderr) {
      this.originalStderr = _stderr;
    }
  }
  write(data, level) {
    let str = data;
    debug('console write:%j', data);
    /* istanbul ignore else */
    if (this.options.format === 'json') {
      str = JSON.stringify(data);
    }
    if (level === 'error') {
      this.stderr.write(`${str}\n`);
    } else {
      this.stdout.write(`${str}\n`);
    }
  }
}

module.exports = Console;
