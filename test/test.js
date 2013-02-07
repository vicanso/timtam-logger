(function() {
  var Logger, assert, jtLogger, _;

  _ = require('underscore');

  assert = require('assert');

  jtLogger = require('../index');

  Logger = require('../lib');

  describe('jtLogger', function() {
    _.each('configure getLogger getConnectLogger'.split(' '), function(func) {
      return describe('\##{func}', function() {
        return it('it should be a function', function() {
          return assert.equal(true, _.isFunction(jtLogger[func]));
        });
      });
    });
    describe('#getLogger', function() {
      return it('it should return a Logger Instance', function() {
        var logger, loggerFuncs;
        logger = jtLogger.getLogger('test');
        loggerFuncs = 'debug error info log trace warn';
        assert.equal(true, logger instanceof Logger);
        return assert.equal(loggerFuncs, _.functions(logger).sort().join(' '));
      });
    });
    return describe('#getConnectLogger', function() {
      return it('it should return a logger for connect', function() {
        var logger;
        logger = jtLogger.getConnectLogger();
        return assert.equal(true, _.isFunction(logger));
      });
    });
  });

}).call(this);
