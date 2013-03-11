###*!
* Copyright(c) 2013 vicanso 腻味
* MIT Licensed
###

log4js = require 'log4js'
_ = require 'underscore'


class Logger
  constructor : (msgPrefix, category) ->
    if msgPrefix
      if _.isArray msgPrefix
        @msgPrefix = "[#{msgPrefix.join(', ')}]"
      else
        @msgPrefix = "[#{msgPrefix}]"
    if category
      @logger = log4js.getLogger category


do () ->
  Logger.prototype.loggers = {}
  _.each 'log info error warn debug trace'.split(' '), (func) ->
    Logger.prototype.loggers[func] = log4js.getLogger "[#{func.toUpperCase()}-LOGGER]"
    Logger.prototype.loggers[func].setLevel func
    Logger.prototype[func] = (args...) ->
      logger = @logger || @loggers[func]
      if @msgPrefix
        args.unshift @msgPrefix
      logger[func].apply logger, args
  _.each 'addListener emit fatal isDebugEnabled isErrorEnabled isFatalEnabled isInfoEnabled isLevelEnabled isTraceEnabled isWarnEnabled listeners on once removeAllListeners removeLevel removeListener setLevel setMaxListeners'.split(' '), (func) ->
    Logger.prototype[func] = (args...) ->
      logger = @logger
      if logger
        logger[func].apply logger, args

module.exports = Logger