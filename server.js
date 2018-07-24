require('module-alias/register') // register module aliasing (see `package.json`)
const config = require('@app-config')
const appBuilder = require('@app-lib/express')
const mongoHelper = require('@app-lib/mongoose')
const logger = require('@app-logger')

// for full http codes explanation,
// see: https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#1xx_Informational_responses

appBuilder.init()
  .then(app => {
    app.listen(config.port, () => {
      mongoHelper.connect(config.db.mongo.uri, config.db.mongo.options)
        .then(() => {
          logger.info(`App is running on ${config.url}`)
        })
        .catch(err => {
          logger.error(`Cannot connect to mongo: ${err.message}`, { err })
          process.exit(1) // 0 - success, 1 - fail
        })
    })
  })
  .catch(err => {
    logger.error('Could not init express app', { err })
  })
