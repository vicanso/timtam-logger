"use strict";
process.env.NODE_ENV = 'production';
var assert = require('assert');
var path = require('path');
var logger = require('../lib/logger');
logger.appPath = path.join(__dirname, '..') + '/';
logger.filter = function(file){
  return file.indexOf('node_modules') === -1;
};
describe('#logger', function(){
  it('should log msg successful', function(done){
    setTimeout(function(){
      console.log('test');
    }, 0);
    var stream = {
      write : function(msg){
        assert.equal(msg.substring(0, msg.length - 24), '[L][test/logger:13] test');
        done();
      }
    };
    logger.stream = stream;
  });
});