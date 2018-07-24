const parseError = require('@app-utils/parse-error')
const { printf } = require('winston').format

module.exports = printf(info => {
  let splatObj = info[Symbol.for('splat')]

  if (splatObj) {
    // get rid from the first object of the splat,
    // because that's the { req, err } which we only need on the
    // info object itself.
    splatObj.shift()
  }

  const error = parseError(info.req, info.err, splatObj)
  return `
    ${info.timestamp} [${info.level}]: ${info.message}

    ${error.method ? 'Method: ' + error.method : ''}
    ${error.url ? 'URL: ' + error.url : ''}
    ${error.user ? 'User: ' + error.user : ''}
    ${error.file ? 'File: ' + error.file : ''}
    ${error.line ? 'Line: ' + error.line : ''}
    ${error.pos ? 'Pos: ' + error.pos : ''}
    ${error.type ? 'Error Type: ' + error.type : ''}
    ${error.message ? 'Error Message: ' + error.message : ''}
    ${error.data ? 'Additinal Data: ' + error.data : ''}
    ${(error.originalStack || error.stack) ? 'Original Stack: ' + (error.originalStack || error.stack) : ''}
    <===========================================>
  `
})
