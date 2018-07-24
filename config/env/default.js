const path = require('path')

module.exports = {
  // App overview info
  app: {
    title: 'Facebook',
    description: 'Cool app to share your life with friends',
    keywords: ['facebook', 'node', 'express', 'mongo']
  },
  port: process.env.PORT || 8080,
  host: process.env.HOST || 'localhost',
  ssl: process.env.NODE_SSL || false,
  debug: true,
  favicon: require.resolve('@app-public/assets/favicon.ico'),
  publicPath: path.dirname(require.resolve('@app-public/notFound.html')),
  compression: {
    level: 0
  },
  session: {
    enable: false,
    secret: process.env.SESSION_SECRET || 'r39cts33ds3ss10nc00k13s3cr3t',
    cookie: {
      // if no `maxAge` is set, then the cookie is considered `session cookie`
      // and will be deleted after session end or browser exit.
      // if you want persistent cookie, then uncomment `maxAge` line below.
      // session will expire after 24 hours
      //maxAge: 24 * (60 * 60 * 1000),

      // httpOnly flag makes sure that the cookie,
      // is accessed only though HTTP protocol
      // and not by JS/browser.
      httpOnly: false,
      // secure cookie should be turned on to provide additional
      // layer of security so that the cookie is set only when
      // working in HTTPS mode.
      secure: false,
      // NOTE: not all clients supports that yet.
      // valid values: true, false, lax, strict.
      sameSite: true,
      // reset `maxAge` of the cookie every request. If you using `maxAge`
      // then consider setting `rolling` to true for the countdown to
      // start after the user is idle.
      //rolling: false
    },
    // if this is `true` then it will enforce the session to resave session
    // object even if it didn't changed. Enable this if your store doesn't
    // support the `touch` command (= if the session will not resaved, it will
    // become idle and deleted from the store). It your store does support `touch`
    // command, then there is not need for resave (because the session will not
    // become idle). Here, we are using MongoStore so there is no need for resave.
    resave: false,
    // set this to true if you want to detect that the user has visited the
    // website once, for example. For most other cases there is no need to save
    // uninitialized session object to the store, hence the default false value.
    saveUninitialized: false
    // when production, add here `store` and `unset` options which control then
    // store which hold the session data and session behavior to unsetting the
    // session object respectively.
  },
  log: {
    // morgan logger settings
    format: process.env.LOG_FORMAT || 'short',
    // winston logger settings
    options: {
      level: process.env.LOG_LEVEL || 'debug',
      exitOnError: true
    },
    rotateFile: {
      level: 'warn',
      zippedArchive: true,
      // we keep this paths relative and not using `require.resolve` since
      // the logs at first is an empty directory and `require.resolve`
      // is resolving modules (index.js or package.json).
      filename: path.join(__dirname, '../../logs', 'facebook-%DATE%.log')
    },
    uncaughtExceptionFile: {
      filename: path.join(__dirname, '../../logs', 'uncaught-exceptions.log'),
      handleExceptions: true
    }
  }
}
