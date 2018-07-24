module.exports = {
  db: {
    mongo: {
      name: 'Facebook_Data',
      uri: process.env.MONGO_URI || 'mongodb://localhost:27017/facebook',
      options: {
        autoIndex: true,
        poolSize: 10,
        user: process.env.MONGO_USER || null,
        pass: process.env.MONGO_PASS || null,
        useNewUrlParser: true
      },
      debug: process.env.MONGO_DEBUG || true
    },
    // You can add more databases for session, caching, other services etc.
    // redis: {
    //   ...
    // }
  },
  session: {
    enable: true
  },
  log: {
    // Set logger/s settings (format, debug etc.)
    level: process.env.LOG_LEVEL || 'debug', // for winston
    format: process.env.LOG_FORMAT || 'short' // for morgan
  },
  app: {
    minChromeSupportedVersion: process.env.MIN_CHROME_VERSION || 50
  }
}
