'use strict';

const debug = require('debug')('timtam-logger');
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
  get options() {
    return _.extend({}, map.get(this));
  }
  /* eslint class-methods-use-this:0 */
  get name() {
    return 'base';
  }
  set prefix(v) {
    map.get(this).prefix = v;
  }
  get prefix() {
    return this.options.prefix;
  }
  set suffix(v) {
    map.get(this).suffix = v;
  }
  get suffix() {
    return this.options.suffix;
  }
  log(level, msg) {
    const options = this.options;
    const now = (new Date()).toISOString();
    let data;
    if (options.format !== 'json') {
      const arr = [];
      arr.push(`[${level}]`);
      if (options.prefix) {
        arr.push(options.prefix);
      }
      arr.push(msg);
      /* istanbul ignore else */
      if (options.extra) {
        arr.push(options.extra);
      }
      /* istanbul ignore else */
      if (options.timestamp) {
        arr.unshift(now);
      }
      if (options.suffix) {
        arr.push(options.suffix);
      }
      data = arr.join(' ');
    } else {
      data = _.extend({
        level,
        msg,
      }, options.extra);
      if (options.prefix) {
        data.prefix = options.prefix;
      }
      if (options.suffix) {
        data.suffix = options.suffix;
      }
      /* istanbul ignore else */
      if (options.timestamp) {
        data.date = now;
      }
    }
    this.write(data, level);
  }
}

module.exports = Transport;
