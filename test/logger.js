"use strict";
process.env.NODE_ENV = 'production';
var assert = require('assert');
var path = require('path');
var logger = require('../lib/logger');
logger.appPath = path.join(__dirname, '..') + '/';
logger.reject = function(file){
  return file.indexOf('node_modules') !== -1;
};
describe('#logger', function(){
  it('should log msg successful', function(done){
    setTimeout(function(){
      console.log('test');
    }, 0);
    var stream = {
      write : function(msg){
        assert.equal(msg.substring(msg.length - 21), 'test [test/logger:13]');
        done();
      }
    };
    logger.add(logger.transports.Stream, stream);
  });
});