const Transport = require('winston-transport')
const {
  logHttpSuccess,
  logHttpError,
  logAppError,
  logAppWarn,
  logAppDebug,
  logAppVerbose,
  logAppInfo
} = require('@app-lib/debugger')

module.exports = class DebugTransport extends Transport {
  constructor(opts) {
    super(opts)
  }

  log(info, callback) {
    switch(info[Symbol.for('level')]) {
      case 'success': {
        logHttpSuccess(info[Symbol.for('message')])
        break
      }
      case 'fail': {
        logHttpError(info[Symbol.for('message')])
        break
      }
      case 'error': {
        logAppError(info[Symbol.for('message')])
        break
      }
      case 'warn': {
        logAppWarn(info[Symbol.for('message')])
        break
      }
      case 'info': {
        logAppInfo(info[Symbol.for('message')])
        break
      }
      case 'debug': {
        logAppDebug(info[Symbol.for('message')])
        break
      }
      default: {
        break
      }
    }

    callback()
  }
}
