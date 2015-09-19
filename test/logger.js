"use strict";
const assert = require('assert');
const logger = require('../lib/logger');
const winston = require('winston');
const mkdirp = require('mkdirp');
const path = require('path');
const dgram = require('dgram');


describe('Logger', function() {
  it('should log successful', function(done) {
    let originalSync = mkdirp.sync;
    mkdirp.sync = function(logPath) {
      assert.equal(logPath, __dirname);
    };


    try {
      logger.add({});
    } catch (e) {

    } finally {

    }

    logger.init([{
      timestamp: true
    }, {
      type: 'file',
      filename: path.join(__dirname, 'test.log')
    }]);
    logger.init();
    logger.add({
      type: 'udp',
      timestamp: true
    });
    mkdirp.sync = originalSync;
    let logMsg = '测试文字输出';
    assert.equal(logMsg, console.info(logMsg));
    let err = new Error('出错啦');
    let str = console.error('test error %s', err);
    let prefixStr = 'test error Error:出错啦, stack:Error: 出错啦';
    assert.equal(str.substring(0, prefixStr.length), prefixStr);
    let transports = logger.transports();
    setTimeout(function() {
      transports[2].close();
      done();
    }, 300);

  });
});
