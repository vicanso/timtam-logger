'use strict';

const dgram = require("dgram");

const server = dgram.createSocket("udp4");

server.on("error", function (err) {
  console.log("server error:\n" + err.stack);
  server.close();
});

server.on("message", function (msg, rinfo) {
  console.log("udp server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
});

server.on("listening", function () {
  let address = server.address();
  console.log("server listening " + address.address + ":" + address.port);
});

server.bind(6000);




const net = require('net');
const tcpServer = net.createServer(function(c) { //'connection' listener
  console.log('client connected');
  c.on('end', function() {
    console.log('client disconnected');
  });
  c.on('data', function  (data) {
  	console.log('tcp server got: ' + data);
  });
});
tcpServer.listen(6000, function() { //'listening' listener
  console.log('server bound');
});