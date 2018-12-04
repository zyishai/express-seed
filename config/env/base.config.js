module.exports = {
    app: {
        env: process.env.NODE_ENV || 'dev',
        port: 3000,
        /* Options for express static middleware,
        *  to disable static content in express 
        *  set this property to `false`.
        *  To customize this middleware pass an
        *  object. Each key is the url for which the directory served for, and the value is its options. 
        *  Options:
        *   enable {Boolean} - enable or disable this url (default: true).
        *   path {String}(required) - path to directory to serve, relative to project root.
        *   options {Object|null} - options to pass to the middleware. Option
        *                       configurations can be found at https://expressjs.com/en/4x/api.html#express.static.
        *  If set uptouched, register root middleware that serve content from 'public' directory.
        */ 
        static: true,
        favicon: true,
        bodyParser: true
    }
}
