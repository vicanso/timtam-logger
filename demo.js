(function() {
  var appenders, cluster, jtLogger, logger, test, uid;

  cluster = require('cluster');

  jtLogger = require('./index');

  uid = 0;

  if (cluster.worker) {
    uid = cluster.worker.uniqueID;
  }

  logger = jtLogger.getLogger(["node:" + uid, __filename]);

  appenders = [
    {
      type: 'console'
    }, {
      type: 'dateFile',
      filename: './log/all'
    }, {
      category: '[WARN-LOGGER]',
      type: 'dateFile',
      filename: './log/warn'
    }, {
      category: '[LOG-LOGGER]',
      type: 'dateFile',
      filename: './log/log'
    }
  ];

  jtLogger.configure({
    appenders: appenders,
    replaceConsole: true
  });

  logger.log('a');

  logger.info('b');

  logger.error('c');

  logger.warn('d');

  logger.debug('e');

  logger.trace('f');

  logger.warn('warn');

  test = function() {
    return logger.error('error');
  };

  test();

  (function() {
    return logger.error('do error');
  })();

}).call(this);
