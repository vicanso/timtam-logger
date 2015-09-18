"use strict";
const winston = require('winston');
const path = require('path');
const util = require('util');
const mkdirp = require('mkdirp');
const UDPTransport = require('./udp-transport');
var isInitialized = false;
var loggerTransports = null;

exports.init = init;
exports.transports = getTransports;

/**
 * [init description]
 * @param  {[type]} transports [description]
 * @return {[type]}            [description]
 */
function init(transports) {
  if (isInitialized) {
    return;
  }

  transports = transports.map(function(options) {
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
  });
  let logger = new(winston.Logger)({
    transports: transports
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
