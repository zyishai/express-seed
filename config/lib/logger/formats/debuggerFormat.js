const { printf } = require('winston').format

module.exports = printf(info => info.message)
