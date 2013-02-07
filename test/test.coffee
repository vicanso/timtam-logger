_ = require 'underscore'
assert = require 'assert'
jtLogger = require '../index'
Logger = require '../lib'


describe 'jtLogger', () ->
  _.each 'configure getLogger getConnectLogger'.split(' '), (func) ->
    describe '\##{func}', () ->
      it 'it should be a function', () ->
        assert.equal true, _.isFunction jtLogger[func]
  describe '#getLogger', () ->
    it 'it should return a Logger Instance', () ->
      logger = jtLogger.getLogger 'test'
      loggerFuncs = 'debug error info log trace warn'
      assert.equal true, logger instanceof Logger
      assert.equal loggerFuncs, _.functions(logger).sort().join ' '
  describe '#getConnectLogger', () ->
    it 'it should return a logger for connect', () ->
      logger = jtLogger.getConnectLogger()
      assert.equal true, _.isFunction logger



