require('dotenv').config() // load .env file to `process.env`
const { merge } = require('lodash')
const defaultConfig = require('./env/default')
let environmentConfig

// require custom config based on NODE_ENV variable
if (['dev', 'development'].indexOf(process.env.NODE_ENV) !== -1) {
  environmentConfig = require('./env/development')
} else {
  environmentConfig = require('./env/production')
}

const config = merge(defaultConfig, environmentConfig)

config.env = process.env.NODE_ENV
config.url = `${config.ssl ? 'https' : 'http'}://${config.host}${config.port ? ':' + config.port : ''}`

module.exports = config
