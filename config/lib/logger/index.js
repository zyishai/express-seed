const path = require('path')
const config = require('@app-config')
const merge = require('lodash.merge')
const winston = require('winston')
const { combine } = winston.format
const DebugTransport = require('./transports/DebugTransport')
const customDebugFormat = require('./formats/debuggerFormat')
const customTimestamp = require('./formats/customTimestamp')
const customFileFormat = require('./formats/fileFormat')
require('winston-daily-rotate-file')

// custom levels and their matching colors
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    success: 2,
    fail: 3,
    info: 4,
    debug: 5
  }
}

/**
 * To use this logger, use it like this:
 *    ```logger.type(<message>, <req and error>, <metadata>)```
 *
 * like:
 *    logger.error('my error message', { req, err }, {
 *      myVar: 5
 *    })
 * or
 *    logger.info('my info message', { req }, {
 *      myName: 'person'
 *    })
 */
const logger = winston.createLogger(merge({
  levels: customLevels.levels,
  transports: [
    // for levels `warn` and `error`
    new (winston.transports.DailyRotateFile)(merge({
      format: combine(
        winston.format.splat(),
        customTimestamp(),
        customFileFormat
      )
    }, config.log.rotateFile))
  ],
  exceptionHandlers: [
    new winston.transports.File(merge({
      format: combine(
        winston.format.splat(),
        customTimestamp(),
        customFileFormat
      )
    }, config.log.uncaughtExceptionFile))
  ],
}, config.log.options))

// attach success and fail streams to logger
require('./streams/morganStreams')(logger)

// check if we in development mode
if (['dev', 'development'].indexOf(config.env)) {
  // add debug transport for `success`, `fail`, `debug` and `info`
  logger.add(new DebugTransport(merge({
    format: combine(
      winston.format.splat(),
      customDebugFormat
    )
  }, config.log.options)))
}

module.exports = logger
