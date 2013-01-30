###*!
* Copyright(c) 2013 vicanso 腻味
* MIT Licensed
###

log4js = require 'log4js'
_ = require 'underscore'


class Logger
  constructor : (@msgPrefix, category) ->
    if msgPrefix
      if _.isArray msgPrefix
        @msgPrefix = "[#{msgPrefix.join(', ')}]"
      else
        @msgPrefix = "[#{msgPrefix}]"
    if category
      @logger = log4js.getLogger category


do () ->
  Logger.prototype.loggers =
    default : log4js.getLogger 'default'
  _.each 'log info error warn debug trace'.split(' '), (func) ->
    Logger.prototype.loggers[func] = log4js.getLogger "[#{func.toUpperCase()}-LOGGER]"
    Logger.prototype.loggers[func].setLevel func
    Logger.prototype[func] = (args...) ->
      logger = @loggers[func] || @loggers['default']
      if func == 'error'
        err = new Error
        info = err.stack.split('\n')[2]
        args.unshift info.trim()
      args.unshift @msgPrefix
      logger[func].apply logger, args


module.exports = Logger