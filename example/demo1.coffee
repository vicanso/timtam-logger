# 普通的logger使用，所有log输出到一个文件，不作区别
jtLogger = require '../index'
jtLogger.moreInfoLog ['error']
logger1 = jtLogger.getLogger 'logger1'
logger2 = jtLogger.getLogger ['logger2', '前缀']

logger1.info '测试输出一'
logger2.warn '测试输出二'
logger2.error '测试输出三'
