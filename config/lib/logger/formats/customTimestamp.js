const moment = require('moment')
const winston = require('winston')
const util = require('util')

module.exports = winston.format((info, opts) => {
  info.timestamp = util.format('%s', moment().format('DD-MM-YYYY HH:mm:ss').trim())

  return info
})
