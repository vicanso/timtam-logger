"use strict";
var logger = require('../lib/logger');
logger.appPath = '/Users/tree/快盘/github/jtlogger/';
logger.logPrefix = '[aofjeoajfe]';
logger.add(logger.transports.Console);

setInterval(function(){
  console.log('log %s', 'test');
  console.info('info');
  console.error('error');
  console.warn('warn');
}, 1000);
