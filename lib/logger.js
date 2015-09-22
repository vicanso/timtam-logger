"use strict";
const winston = require('winston');
const path = require('path');
const util = require('util');
const mkdirp = require('mkdirp');
const UDPTransport = require('./udp-transport').UDP;
var isInitialized = false;
var loggerTransports = null;
var defaultLogger = null;
exports.init = init;
exports.transports = getTransports;
exports.add = add;
exports.remove = remove;


/**
 * [init description]
 * @param  {[type]} transports [description]
 * @return {[type]}            [description]
 */
function init(transports) {
  if (isInitialized) {
    return;
  }
  transports = transports || [];
  transports = transports.map(createTransport);
  let logger = new(winston.Logger)({
    transports: transports,
    exitOnError: false
  });
  let fns = ['info', 'warn', 'error'];
  fns.forEach(function(fn) {
    console[fn] = function() {
      let args = Array.from(arguments);
      if (fn === 'error') {
        args = args.map(function(argument) {
          if (util.isError(argument)) {
            return 'Error:' + argument.message + ', stack:' +
              argument.stack;
          } else {
            return argument;
          }
        });
      }
      let str = util.format.apply(util, args);
      logger.log(fn, str);
      return str;
    };
  });
  defaultLogger = logger;
  loggerTransports = transports;
  isInitialized = true;
}

/**
 * [getTransports description]
 * @return {[type]} [description]
 */
function getTransports() {
  return loggerTransports;
}


/**
 * [createTransport description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function createTransport(options) {
  let type = options.type || 'console';
  let transport = null;
  delete options.type;
  switch (type) {
    case 'file':
      mkdirp.sync(path.dirname(options.filename));
      transport = new(winston.transports.File)(options);
      break;
    case 'udp':
      transport = new UDPTransport(options);
      break;
    default:
      transport = new(winston.transports.Console)(options);
  }
  return transport;
}

/**
 * [add description]
 * @param {[type]} options [description]
 */
function add(options) {
  let transport = createTransport(options);
  if (!loggerTransports) {
    throw new Error('logger is not init!');
  }
  loggerTransports.push(transport);
  defaultLogger.add(transport, null, true);
  return transport;
}

/**
 * [remove description]
 * @param  {[type]} transport [description]
 * @return {[type]}           [description]
 */
function remove(transport) {
  let index = loggerTransports.indexOf(transport);
  if (index !== -1) {
    loggerTransports.splice(index, 1);
    defaultLogger.remove(transport);
  }
}
