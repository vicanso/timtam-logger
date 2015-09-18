"use strict";
const winston = require('winston');
const dgram = require('dgram');
const util = require('util');

/**
 * [UDP description]
 * @param {[type]} options [description]
 */
function UDP(options) {
  this.client = dgram.createSocket('udp4');
  this.options = options;
  this.doingCount = 0;
}

util.inherits(UDP, winston.Transport);

UDP.prototype.log = function(level, msg, meta, cb) {
  let options = this.options;

  let data = {
    message: msg,
    level: level
  };
  if (options.timestamp) {
    data.timestamp = (new Date()).toISOString();
  }
  let buf = new Buffer(JSON.stringify({
    tag: options.tag || 'default',
    log: JSON.stringify(data)
  }));
  let client = this.client;
  this.doingCount++;
  client.send(buf, 0, buf.length, options.port || 6000, options.host ||
    '127.0.0.1',
    function(err) {
      this.doingCount--;
      if (err) {
        cb(err);
      } else {
        cb(null, true);
      }
    });
};

UDP.prototype.close = function() {
  this.client.close();
};


module.exports = UDP;
