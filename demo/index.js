"use strict";
const logger = require('../lib/logger');
const path = require('path');


logger.init([{
  type: 'console',
  timestamp: true
}, {
  type: 'file',
  filename: path.join(__dirname, 'test.log')
}]);

logger.add({
  type: 'udp',
  tag: 'test',
  host: '127.0.0.1',
  port: 600
});

console.info('test log');
