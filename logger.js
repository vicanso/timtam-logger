'use strict';

const util = require('util');

const Console = require('./transports/console');
const UDP = require('./transports/udp');

// { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  log: 2,
  debug: 3,
};
const optionsSym = Symbol('option');
const transportsSym = Symbol('transports');
const beforeSym = Symbol('before');
const afterSym = Symbol('after');

function isFunction(fn) {
  return Object.prototype.toString.call(fn) === '[object Function]';
}

class Logger {
  constructor(options) {
    this[optionsSym] = Object.assign({
      app: 'timtam',
      timestamp: true,
      // 日志最大长度
      maxLength: 900,
      level: 3,
    }, options);
    this[transportsSym] = [];
    this[beforeSym] = [];
    this[afterSym] = [];
    this.wrap(this);
  }
  get options() {
    return Object.assign({}, this[optionsSym]);
  }
  set(k, v) {
    const options = this[optionsSym];
    if (k && typeof k === 'object') {
      Object.assign(options, k);
    } else {
      options[k] = v;
    }
    return this;
  }
  add(type, opts) {
    const options = Object.assign(this.options, opts);
    const reg = /(\S+?):\/\/(\S+):(\S+)/;
    const result = reg.exec(type);
    if (result && result[1] && result[2] && result[3]) {
      type = result[1];
      options.host = result[2];
      options.port = parseInt(result[3], 10);
    }
    let transport;
    if (type === 'udp') {
      transport = new UDP(options);
    } else {
      transport = new Console(options);
    }
    this[transportsSym].push(transport);
    return transport;
  }
  remove(transport) {
    const transports = this[transportsSym];
    const index = transports.indexOf(transport);
    if (index !== -1) {
      transports.splice(index, 1);
    }
    return this;
  }
  rawLog(type, str) {
    const transports = this[transportsSym];
    transports.forEach(transport => transport.log(type, str));
  }
  wrap(obj, names) {
    const fnNames = names || 'log info warn error debug'.split(' ');
    const options = this.options;
    const beforeList = this[beforeSym];
    const afterList = this[afterSym];
    fnNames.forEach((name) => {
      obj[name] = function wrapFn() {
        if (logLevels[name] > options.level) {
          return;
        }
        /* eslint prefer-rest-params:0 */
        let args = Array.from(arguments);
        const maxLength = options.maxLength;
        if (name === 'error') {
          args = args.map((argument) => {
            if (argument.message && argument.stack) {
              return `Error:${argument.message}, stack:${argument.stack}`; 
            }
            return argument;
          });
        }
        /* eslint prefer-spread:0 */
        let str = util.format.apply(util, args);

        const msgList = [];
        beforeList.forEach((item) => {
          if (isFunction(item)) {
            msgList.push(item());
          } else {
            msgList.push(item);
          }
        });
        if (msgList.length) {
           str = `${msgList.join(' ')} ${str}`;
           msgList.length = 0;
        }

        afterList.forEach((item) => {
          if (isFunction(item)) {
            msgList.push(item());
          } else {
            msgList.push(item);
          }
        });
        if (msgList.length) {
          str += ` ${msgList.join(' ')}`;
        }

        if (str.length > maxLength) {
          str = `${str.substring(0, maxLength)}...`;
        }
        this.rawLog(name, str);
      };
    });
  }
  after(param) {
    this[afterSym].push(param);
  }
  before(param) {
    this[beforeSym].push(param);
  }
}

module.exports = Logger;
