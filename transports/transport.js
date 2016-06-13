const debug = require('debug')('jt.timtam-logger');
const _ = require('lodash');
const map = new WeakMap();

class Transport {
  constructor(opts) {
    const options = _.clone(opts || {});
    /* istanbul ignore else */
    if (options.extra && options.format !== 'json') {
      options.extra = _.map(options.extra, (v, k) => `${k}=${v}`).join();
    }

    debug('options:%j', options);
    map.set(this, options);
  }

  write() {
    // 继承的transport各自实现
  }
  get options() {
    return map.get(this);
  }
  get name() {
    return 'base';
  }
  log(level, msg) {
    const options = this.options;
    const now = (new Date()).toISOString();
    let data;
    if (options.format !== 'json') {
      data = `[${level}] ${msg}`;
      /* istanbul ignore else */
      if (options.extra) {
        data += (` ${options.extra}`);
      }
      /* istanbul ignore else */
      if (options.timestamp) {
        data = `${now} ${data}`;
      }
    } else {
      data = _.extend({
        level,
        msg,
      }, options.extra);
      /* istanbul ignore else */
      if (options.timestamp) {
        data.date = now;
      }
    }
    this.write(data, level);
  }
}

module.exports = Transport;
