const path = require('path')
const { isError } = require('lodash')
const stringify = require('stringify-object')

/**
 * Parse error stack and return basic information about error.
 *
 * @param  {String} stack the error stack.
 * @return {Object} filename and position where the error occurred.
 */
function analyzeStack(stack) {
    const stackRegex = /(\(.*?\))/
    const filePathRegex = /(\/.*?(?=:))/
    const lineRegex = /\d+?(?=:)/
    const posRegex = /\d+?(?=\))/

    const stackArr = stackRegex.exec(stack)

    if (!stackArr || !stackArr.length) {
      return {
        file: '',
        line: 0,
        pos: 0
      }
    }

    const stackTop = stackArr[0]
    const fileRes = filePathRegex.exec(stackTop)
    const lineRes = lineRegex.exec(stackTop)
    const posRes = posRegex.exec(stackTop)

    return {
        file: fileRes ? fileRes[0] : undefined,
        line: lineRes ? lineRes[0] : undefined,
        pos: posRes ? posRes[0] : undefined
    }
}

module.exports = (req, err, meta) => {
    if (!err || !isError(err)) {
        return {
            file: '',
            line: 0,
            pos: 0,
            type: '',
            originalStack: '',
            message: '',
            user: '',
            data: {},
            url: '',
            method: ''
        }
    }

    const { file, line, pos } = analyzeStack(err.stack)

    // set meta data as object
    if (meta instanceof Array) {
      meta = meta.reduce((acc, value) => Object.assign(acc, value), {})
    } else if (!(meta instanceof Object)) {
      meta = {}
    }

    return {
        file: file || '',
        line: line || 0,
        pos: pos || 0,
        type: err.type || err.name,
        originalStack: err.originalStack || err.stack,
        message: err.message,
        user: req ? (req.user || (req.session && req.session.user)) : '',
        data: stringify({
            body: req ? req.body : {},
            // hostname: require('os').hostname(),
            meta
        }),
        url: req ? req.originalUrl : '',
        method: req ? req.method : ''
    }
}
