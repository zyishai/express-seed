const config = require('@app-config')
const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const compression = require('compression')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const morgan = require('morgan')
const helmet = require('helmet')
const lusca = require('lusca')
const csurf = require('csurf')
const chalk = require('chalk')
const logger = require('@app-logger')
const mongoHelper = require('./mongoose')

const _methods = {
  initMiddlewares() {
    // compress static assets.
    this.app.use(compression({
      level: config.compression.level,
      filter: function(req, res) {
        return (/json|text|javascript|css|font|svg/)
        .test(res.getHeader('Content-Type'))
      }
    }))
    // load favicon. It will cache the favicon for 1 year, by default.
    // to change it, pass second option object to the constructor
    // and set the `maxAge` option.
    this.app.use(favicon(config.favicon))
    // set static assets path.
    this.app.use(express.static(config.publicPath))

    // set view engine
    this.app.engine('html', require('ejs').renderFile)
    this.app.set('view engine', 'html')
    this.app.set('views', config.publicPath)

    // set caching and x-powered-by header
    if (['dev', 'development'].indexOf(config.env) !== -1) {
      this.app.disable('view cache')
      this.app.enable('x-powered-by')
    } else {
      this.app.set('env', 'production') // will set `view cache` to true automatically.
      this.app.disable('x-powered-by')
    }

    // parse request body and populate `req.body`.
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))

    // allow use query string `?_method=DELETE` to cast POST request
    // to another method (like DELETE or PUT). Usefull when the regular way
    // cannot be used, for example in form DELETE requests cannot be
    // made (only GET and POST allowed), so we can to something like this:
    // <form method="POST" action="resource?_method=DELETE">
    //
    // This form will make POST request but cast it to be DELETE request.
    // The original method is exposed in `req.originalMethod`.
    this.app.use(methodOverride('_method'))

    // parse cookies and populate `req.cookies` and `req.signedCookies`.
    // If cookies are signed, then pass to the middleware the key as a string
    // or an array of keys. IMPORTANT: if passing key, then make sure that the
    // key passed is the same as the session's cookie key!
    // NOTE: to create cookie use the package `cookie` like this:
    // res.setHeader('Set-Cookie', cookie.serialize('name', String(query.name), {
    //  httpOnly: true,
    //  maxAge: 60 * 60 * 24 * 7 // 1 week
    // }))
    // To see full demo and more visit: https://github.com/jshttp/cookie
    this.app.use(cookieParser())

    return this
  },

  initSession() {
    if (config.ssl) {
      // if express application is behind proxy, `trust proxy` is required
      // to enable `secure` cookie.
      this.app.set('trust proxy', 1)
    }

    this.app.use(session(config.session))
    // set flash messages. useful when you want to save data between redirects.
    // the flash message is saved on the session and cleared after being displayed
    // to the user.
    this.app.use(flash())

    return this
  },

  initMorgan() {
    // log successfull responses
    this.app.use(morgan(config.log.format, {
      skip: (req, res) => {
        return res.statusCode >= 400
      },
      stream: logger.successStream
    }))

    // log error responses
    this.app.use(morgan(config.log.format, {
      skip: (req, res) => {
        return res.statusCode < 400
      },
      stream: logger.failStream
    }))

    return this
  },

  initSecurityMiddlewares() {
    this.app.use(helmet())
    this.app.use(lusca())
    this.app.use(csurf())

    return this
  },

  initRoutes() {
    require('@app-api')(this.app)
      .catch(err => {
        logger.error('Couldn\'t load routes', { err }, {
          route_dir_path: err.path
        })
      })
      .then(() => this._initErrorRoutes())

    return this
  },

  _initErrorRoutes() {
    // handle unknown routes
    this.app.use((req, res) => {
      res.format({
        'text/html': function() {
          res.status(404).render('notFound', {
            url: req.originalUrl
          })
        },
        'default': function() {
          res.status(404).send(`Path: ${req.originalUrl} not found`)
        }
      })
    })

    // handle uncaught errors
    this.app.use((err, req, res, next) => {
      if (!err) {
        return next()
      }

      logger.error('Internal server error at error middleware', { req, err })
    })

    return this
  },

  setProcessListeners() {
    process.on('exit', (code) => {
      logger.info(`Exiting app with code ${code}`)
    })
    process.on('uncaughtException', (err) => {
      err.stack = err.stack
      err.type = err.code
      logger.error('Uncaught exception in node process', { err }, {
        syscall: err.syscall,
        address: err.address,
        port: err.port
      })
    })
  }
}

module.exports = {
  init(callback) {
    _methods.app = express()

    _methods
      .initMiddlewares()
      .initMorgan()
      .initSession()
      .initSecurityMiddlewares()
      .initRoutes()
      .setProcessListeners()

      if (callback instanceof Function) {
        callback(_methods.app)
      } else {
        return Promise.resolve(_methods.app)
      }
  }
}
