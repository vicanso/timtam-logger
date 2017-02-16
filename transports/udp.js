'use strict';

const debug = require('debug')('timtam-logger');
const _ = require('lodash');
const dgram = require('dgram');

const Transport = require('./transport');

class UDP extends Transport {
  constructor(opts) {
    const options = _.extend({}, {
      separator: 9,
      port: 7001,
      host: '127.0.0.1',
    }, opts);
    super(options);
    const bufPrefix = new Buffer(`${options.app} `);
    bufPrefix[bufPrefix.length - 1] = options.separator;
    /* eslint no-underscore-dangle:0 */
    this._bufPrefix = bufPrefix;
    /* eslint no-underscore-dangle:0 */
    this._client = dgram.createSocket('udp4');
    debug('options:%j', options);
  }
  /* eslint class-methods-use-this:0 */
  get name() {
    return 'udp';
  }
  write(data) {
    debug('udp write:%s', data);
    const options = this.options;
    /* eslint no-underscore-dangle:0 */
    const buf = Buffer.concat([this._bufPrefix, new Buffer(data)]);
    /* eslint no-underscore-dangle:0 */
    this._client.send(buf, 0, buf.length, options.port, options.host);
  }
}

module.exports = UDP;
