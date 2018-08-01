/**
 * NOTE: USE THIS MODULE IN DEVELOPMENT MODE ONLY!
 *
 * 1. Remember to install `supports-color` module alongside this module,
 *    otherwise, this module will use only small handful of basic colors..
 * 2. To enable different debugging types, set DEBUG environment in .env file.
 *    To enable all debug types you can use the wildcard character, *.
 *    To disable specific type append `-` to the name of the type.
 *    For example, DEBUG=*,-http will enable all types except `http`.
 */

const config = require('@app-config')
const debug = require('debug')
const { merge } = require('lodash')

const stubs = {
  logHttpSuccess: () => {},
  logHttpError: () => {},
  logAppError: () => {},
  logAppWarn: () => {},
  logAppDebug: () => {},
  logAppVerbose: () => {},
  logAppInfo: () => {}
}
let debugFns = {
  logHttpSuccess: debug('http:success'),
  logHttpError: debug('http:error'),
  logAppError: debug('app:error'),
  logAppWarn: debug('app:warning'),
}

if (config.debug) {
  debugFns = merge(debugFns, {
    logAppDebug: debug('app:debug'),
    logAppVerbose: debug('app:verbose'),
    logAppInfo: debug('app:info')
  })

  // set log type colors
  debugFns.logHttpSuccess.color = debug.colors[2] // green
  debugFns.logHttpError.color = debug.colors[5] // red
  debugFns.logAppError.color = debug.colors[5] // red
  debugFns.logAppWarn.color = debug.colors[6] // orange
  debugFns.logAppDebug.color = debug.colors[3] // blue
  debugFns.logAppInfo.color = debug.colors[0] // cyan
}

module.exports = merge(stubs, debugFns)
