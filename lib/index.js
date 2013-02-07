
/**!
* Copyright(c) 2013 vicanso 腻味
* MIT Licensed
*/


(function() {
  var Logger, log4js, _,
    __slice = [].slice;

  log4js = require('log4js');

  _ = require('underscore');

  Logger = (function() {

    function Logger(msgPrefix, category) {
      this.msgPrefix = msgPrefix;
      if (msgPrefix) {
        if (_.isArray(msgPrefix)) {
          this.msgPrefix = "[" + (msgPrefix.join(', ')) + "]";
        } else {
          this.msgPrefix = "[" + msgPrefix + "]";
        }
      }
      if (category) {
        this.logger = log4js.getLogger(category);
      }
    }

    return Logger;

  })();

  (function() {
    Logger.prototype.loggers = {};
    return _.each('log info error warn debug trace'.split(' '), function(func) {
      Logger.prototype.loggers[func] = log4js.getLogger("[" + (func.toUpperCase()) + "-LOGGER]");
      Logger.prototype.loggers[func].setLevel(func);
      return Logger.prototype[func] = function() {
        var args, logger;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        logger = this.logger || this.loggers[func];
        return logger[func].apply(logger, args);
      };
    });
  })();

  module.exports = Logger;

}).call(this);
