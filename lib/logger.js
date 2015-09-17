"use strict";
const winston = require('winston');
const path = require('path');
const util = require('util');
const UDPTransport = require('./udp-transport');

function noop() {
  // body...
}

function init(transports) {
  init = noop;
  transports = transports.map(function(options) {
    let type = options.type || 'console';
    let transport = null;
    delete options.type;
    switch (type) {
      case 'file':
        mkdirp.sync(path.dirname(transport.filename));
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
    };
  });
  // let type = transport.type || 'console';
  //
  //
  // if (type === 'file') {
  //
  // }
  // delete transport.type;


}

init([{
  type: 'console',
  timestamp: true
}, {
  type: 'udp',
  timestamp: true,
  host: '127.0.0.1',
  port: 6000
}]);

console.info('aojfeoajfe');

console.error(new Error('aofjeaof'));
// var logger = new(winston.Logger)({
//   transports: [
//     new(winston.transports.Console)({
//       level: 'error'
//     }),
//     new(winston.transports.File)({
//       filename: 'somefile.log'
//     })
//   ]
// });
//
// console.dir(logger);
