const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

module.exports = {
  debug: false,
  ssl: process.env.NODE_SSL || true,
  db: {
    mongo: {
      name: 'Facebook',
      uri: process.env.MONGO_URI,
      options: {
        autoIndex: false,
        poolSize: 10,
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASS,
        useMongoClient: true
      },
      debug: false
    }
  },
  compression: {
    level: 9
  },
  session: {
    enable: true,
    cookie: {
      secure: true // need `https`! also make sure that `config.ssl` is enabled!
    },
    unset: 'keep',
    store: new MongoStore({
      url: process.env.MONGO_STORE_URI || 'mongodb://localhost/session',
      // make sure that the session data will not removed from the store.
      // if the session cookie have expiration date, MongoStore will use that.
      // you can change that by setting `ttl` option (seconds)
      // `autoRemove` option get the following values:
      // 'disabled' - no remove of session data from the store.
      // 'native' - default (MongoStore will create ttl index for you).
      // 'interval' - should set `autoRemoveInterval` option with the interval (in minutes).
      autoRemove: 'disabled',
      // stringify and parse the session data when saving and retrieving to/from
      // the store.
      // set this option to false if you save only data types which mongo support.
      stringify: true,
    }),
  },
  log: {
    options: {
      level: process.env.LOG_LEVEL || 'warn'
    }
  }
}
