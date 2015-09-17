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
  let buf = new Buffer(JSON.stringify(data));
  this.client.send(buf, 0, buf.length, options.port, options.host,
    function(err) {
      if (err) {
        cb(err);
      } else {
        cb(null, true);
      }
    });
};

module.exports = UDP;
