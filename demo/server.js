'use strict';

const dgram = require("dgram");

const server = dgram.createSocket("udp4");

server.on("error", function(err) {
	console.log("server error:\n" + err.stack);
	server.close();
});

server.on("message", function(buf, rinfo) {
  // if (buf[0] !== 0x7b || buf[buf.length - 1] !== 0x7d) {
  //  console.dir(rinfo);
  //  console.dir('error');
  //  return;
  // }
	// log(buf, 'udp');
	// if (msg.charAt(0) !== '{') {
	// 	console.error('udp data error');
	// }
	// checkMsg(msg);
	// console.log("udp server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
});

server.on("listening", function() {
	let address = server.address();
	console.log("server listening " + address.address + ":" + address.port);
});

server.bind(6000);


function splitBuffer(buf, value) {
	let arr = [];
	let start = 0;
	let index = buf.indexOf(value, start);
	while (index !== -1) {
		arr.push(buf.slice(start, index));
		start = index + 1;
		index = buf.indexOf(value, start);
	}
	return arr;
}


const net = require('net');
const tcpServer = net.createServer(function(c) { //'connection' listener
	console.log('client connected');
	c.on('end', function() {
		console.log('client disconnected');
	});
	c.on('data', function(buf) {
		if (!buf.length) {
			return;
		}
		let index = buf.indexOf(0);
		if (index === buf.length - 1) {
			log(buf.slice(0, index), 'tcp');
		} else {
			if (buf[buf.length - 1] !== 0) {
				console.error('error');
			} else {
				let arr = splitBuffer(buf, 0);
				arr.forEach(log, 'tcp');
			}
		}
	});
});
tcpServer.listen(6000, function() { //'listening' listener
	console.log('server bound');
});


function log(buf, type) {
	if (buf[0] !== 0x7b || buf[buf.length - 1] !== 0x7d) {
		console.dir(type);
		console.dir('error');
		return;
	}
	JSON.parse(buf.toString());
}

function checkMsg(msg) {
	if (msg.charAt(0) !== '{' || msg.charAt(msg.length - 1) !== '}') {
		console.error('msg content error');
		console.dir(msg);
		return;
	}
	let arr = msg.split('}{');
	if (arr.length !== 1) {
		let total = arr.length;
		arr = arr.map(function(tmp, i) {
			if (!i) {
				return tmp + '}';
			} else if (i === total - 1) {
				return '{' + tmp;
			} else {
				return '{' + tmp + '}';
			}
		});
	}
	arr.forEach(function(tmp) {
		try {
			JSON.parse(tmp);
		} catch (err) {
			console.dir(tmp);
		}

	});
}