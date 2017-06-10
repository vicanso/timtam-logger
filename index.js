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
  /**
   * Creates an instance of Logger.
   * @param {Object} options The options for logger
   *
   * @memberOf Logger
   */
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
  }
  /**
   * Get the options of logger
   *
   * @readonly
   *
   * @memberOf Logger
   */
  get options() {
    return Object.assign({}, this[optionsSym]);
  }
  /**
   * Set the value to options
   *
   * @param {String} k The key of value
   * @param {any} v The value
   * @returns {Logger}
   *
   * @memberOf Logger
   */
  set(k, v) {
    const options = this[optionsSym];
    if (k && typeof k === 'object') {
      Object.assign(options, k);
    } else {
      options[k] = v;
    }
    return this;
  }
  /**
   * Add transport for logger
   *
   * @param {String} type The transport type or the transport uri
   * @param {Object} opts The options for transport
   * @returns {Transport}
   *
   * @memberOf Logger
   */
  add(type, opts) {
    const options = Object.assign(this.options, opts);
    const reg = /(\S+?):\/\/(\S+):(\S+)/;
    const result = reg.exec(type);
    let transportType = type;
    if (result && result[1] && result[2] && result[3]) {
      transportType = result[1];
      options.host = result[2];
      options.port = parseInt(result[3], 10);
    }
    let transport;
    if (transportType === 'udp') {
      transport = new UDP(options);
    } else {
      transport = new Console(options);
    }
    this[transportsSym].push(transport);
    return transport;
  }
  /**
   * Remove the transport from logger
   *
   * @param {Transport} transport - The transport
   * @returns {Logger}
   *
   * @memberOf Logger
   */
  remove(transport) {
    const transports = this[transportsSym];
    const index = transports.indexOf(transport);
    if (index !== -1) {
      transports.splice(index, 1);
    }
    return this;
  }
  rawLog(type, args) {
    const options = this.options;
    const beforeList = this[beforeSym];
    const afterList = this[afterSym];
    const transports = this[transportsSym];
    // if the log level is gt options.level, ignore
    if (logLevels[type] > options.level) {
      return;
    }
    const maxLength = options.maxLength;
    let argsClone = args.slice(0);
    if (type === 'error') {
      argsClone = argsClone.map((argument) => {
        // convert error to string
        if (argument.message && argument.stack) {
          return `Error:${argument.message}, stack:${argument.stack}`;
        }
        return argument;
      });
    }
    /* eslint prefer-spread:0 */
    let str = util.format.apply(util, argsClone);

    const msgList = [];
    // handle before list
    beforeList.forEach((item) => {
      let msg = item;
      if (isFunction(item)) {
        msg = item();
      }
      if (msg) {
        msgList.push(msg);
      }
    });
    if (msgList.length) {
      str = `${msgList.join(' ')} ${str}`;
      msgList.length = 0;
    }
    // handle after list
    afterList.forEach((item) => {
      let msg = item;
      if (isFunction(item)) {
        msg = item();
      }
      if (msg) {
        msgList.push(msg);
      }
    });

    if (msgList.length) {
      str += ` ${msgList.join(' ')}`;
    }
    // cut string
    if (str.length > maxLength) {
      str = `${str.substring(0, maxLength)}...`;
    }
    transports.forEach(transport => transport.log(type, str));
  }
  /**
   * Log function(like console.log)
   *
   * @returns {Logger}
   *
   * @memberOf Logger
   */
  log() {
    /* eslint prefer-rest-params:0 */
    const args = Array.from(arguments);
    this.rawLog('log', args);
    return this;
  }
  /**
   * Info function(like console.info)
   *
   * @returns {Logger}
   *
   * @memberOf Logger
   */
  info() {
    /* eslint prefer-rest-params:0 */
    const args = Array.from(arguments);
    this.rawLog('info', args);
    return this;
  }
  /**
   * Warn function(like console.warn)
   *
   * @returns {Logger}
   *
   * @memberOf Logger
   */
  warn() {
    /* eslint prefer-rest-params:0 */
    const args = Array.from(arguments);
    this.rawLog('warn', args);
    return this;
  }
  /**
   * Error function(like console.error)
   *
   * @returns {Logger}
   *
   * @memberOf Logger
   */
  error() {
    /* eslint prefer-rest-params:0 */
    const args = Array.from(arguments);
    this.rawLog('error', args);
    return this;
  }
  /**
   * Debug function(like console.debug)
   *
   * @returns {Logger}
   *
   * @memberOf Logger
   */
  debug() {
    /* eslint prefer-rest-params:0 */
    const args = Array.from(arguments);
    this.rawLog('debug', args);
    return this;
  }
  /**
   * Wrap the target to use logger
   *
   * @param {any} target The target to wrap, such as console
   * @param {Array} fns The function names
   *
   * @memberOf Logger
   */
  wrap(target, fns) {
    const defaultFns = 'log info warn error debug'.split(' ');
    (fns || defaultFns).forEach((name) => {
      const fn = this[name].bind(this);
      /* eslint no-param-reassign:0 */
      target[name] = fn;
    });
  }
  /**
   * Add insertAfter handle
   *
   * @param {String|Function} param The string(function) to insertAfter
   *
   * @memberOf Logger
   */
  after(param) {
    this[afterSym].push(param);
  }
  /**
   * Add insertBefore handle
   *
   * @param {String|Function} param The string(function) to insertBefore
   *
   * @memberOf Logger
   */
  before(param) {
    this[beforeSym].push(param);
  }
}

module.exports = Logger;
