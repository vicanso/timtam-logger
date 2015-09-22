"use strict";
const logger = require('../lib/logger');
const path = require('path');
const dgram = require("dgram");
const server = dgram.createSocket("udp4");
const port = 6000;
server.on('error', function(err) {
  console.error(err);
});

server.on('message', function(buf, rinfo) {
  let data = JSON.parse(buf.toString());
  console.dir(data);
});

server.on('listening', function() {
  let address = server.address();
  console.info('server listening ' + address.address + ':' + address.port);
});
server.bind(port);

logger.init([{
    type: 'console',
    timestamp: true
  }
  // , {
  //   type: 'file',
  //   filename: path.join(__dirname, 'test.log')
  // }
]);

let udpTransport = logger.add({
  timestamp: true,
  type: 'udp',
  tag: 'test',
  host: '127.0.0.1',
  port: port
});
let total = 0;
setInterval(function() {
  console.info('test log' + Math.random());
  total++;
  if (total === 5) {
    logger.remove(udpTransport);
  }

}, 1000);
