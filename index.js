'use strict';

const util = require('util');
const _ = require('lodash');

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
const defaultOptions = {
  app: 'timtam',
  timestamp: true,
  // 日志最大长度
  maxLength: 900,
  level: 3,
};
const defaultFns = 'log info warn error debug'.split(' ');
const transports = [];

function log(type, str) {
  transports.forEach(transport => transport.log(type, str));
}

function wrap(obj, _fns) {
  const fns = _fns || defaultFns;
  _.forEach(fns, (fn) => {
    /* eslint no-param-reassign:0 */
    obj[fn] = function wrapFn() {
      if (logLevels[fn] > defaultOptions.level) {
        return;
      }
      /* eslint prefer-rest-params:0 */
      let args = Array.from(arguments);
      const maxLength = defaultOptions.maxLength;
      if (fn === 'error') {
        args = args.map((argument) => {
          if (_.isError(argument)) {
            return `Error:${argument.message}, stack:${argument.stack}`;
          }
          return argument;
        });
      }
      /* eslint prefer-spread:0 */
      let str = util.format.apply(util, args);
      if (str.length > maxLength) {
        str = `${str.substring(0, maxLength)}...`;
      }
      log(fn, str);
    };
  });
}

function init() {
  wrap(exports);
}

function set(k, v) {
  if (_.isObject(k)) {
    _.extend(defaultOptions, k);
  } else {
    defaultOptions[k] = v;
  }
}

/**
 * [add description]
 * @param {[type]} type    [description]
 * @param {[type]} options [description]
 */
function add(type, options) {
  options = _.extend({}, options, defaultOptions);
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
  transports.push(transport);
  return transport;
}

/**
 * [remove description]
 * @param  {[type]} transport [description]
 * @return {[type]}           [description]
 */
function remove(transport) {
  const index = transports.indexOf(transport);
  /* istanbul ignore else */
  if (index !== -1) {
    transports.splice(index, 1);
  }
}

exports.wrap = wrap;
exports.add = add;
exports.remove = remove;
exports.set = set;

init();
