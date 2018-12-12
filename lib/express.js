const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { 
    registerFaviconMiddleware,
    registerCompressionMiddleware,
    registerBodyParserMiddleware,
    registerStaticContentMiddleware
} = require('./utils/middleware');
const { throwError, AppError } = require('./utils/error');
const log = require('./utils/logger');
const pluginManager = require('./plugins');

// =============================================================================================

/**
 * Manage cluster initialization and behavior.
 */
class Cluster {
    constructor(appConfig) {
        this.config = appConfig || {};
        this.app = express();
        this.server = null;
    }

    /**
     * Create http/s server.
     */
    createServer() {
        // run https server
        if (this.config.ssl) {
            // validate ssl configurations
            if (typeof(this.config.ssl) !== 'object') {
                throwError('SSL configurations must be an object!');
            }
            if (!this.config.ssl.key || !this.config.ssl.cert) {
                throwError('Missing key or cert properties!');
            }

            this.server = https.createServer(this.config.ssl, this.app);
            this.app.locals.schema = 'https';
        } else { // run http server
            this.server = http.createServer(this.app);
            this.app.locals.schema = 'http';
        }
    }

    /**
     * Set application level settings (e.g env, x-powered-by, view engine etc).
     */
    setApplicationSettings() {
        // custom user settings.
        if (this.config.settings && typeof(this.config.settings) === 'object') {
            Object.keys(this.config.settings)
                .forEach(key => {
                    let value = this.config.settings[key];
                    this.app.set(key, value);
                    log.debug(`setting "${key}" to "${value}"`);
                });
        } 

        // override 'env' settings to match NODE_ENV.
        let value = this.config.env === 'prod' ? 'production' : this.config.env;
        this.app
            .set('env', value);
        log.debug(`setting "env" to "${value}"`);
    }

    /**
     * Register application level middlewares.
     */
    registerMiddlewares() {
        registerFaviconMiddleware(this.app, this.config.favicon);
        registerCompressionMiddleware(this.app, this.config.compression);
        registerBodyParserMiddleware(this.app, this.config.bodyParser);
        registerStaticContentMiddleware(this.app, this.config.static);
    }

    /**
     * Register all routes in api/routes folder.
     */
    loadRoutes() {
        const apiPath = path.join(process.cwd(), 'api', 'routes')
        
        // check that path exists.
        if (!fs.existsSync(apiPath)) {
            throwError({
                type: 'Application.PathNotExists',
                message: 'path not exists.',
                detail: 'path "api/routes" did not found in current working directory.',
                extendedInfo: `Searched path: ${apiPath}`
            });
        }

        // load routes and register them.
        fs.readdir(apiPath, (err, files) => {
            if (err) {
                throwError({
                    type: 'Application.FileSystemReadError',
                    message: err.message,
                    detail: `Error while reading path ${apiPath} (path exists).`,
                    extendedInfo: err.stack,
                    errorCode: err.code
                });
            }

            // register routes.
            files.forEach(file => {
                require(path.join(apiPath, file))(this.registerRoute.bind(this));
            });
        });
    }

    /**
     * Register router handler for specific url.
     * 
     * @param {String} url the url for the route.
     * @param {Object} router router object to register for the url.
     */
    registerRoute(url, router) {
        // TODO: handle this better (maybe seperate checks)
        if (!url || typeof(url) !== 'string' || !router) return;

        this.app.use(url, router);
    }

    registerPlugins() {
        const pluginsPath = path.join(process.cwd(), 'plugins');
        
        // check if plugins path exists.
        if (!fs.existsSync(pluginsPath)) {
            throwError({
                type: 'Application.PathNotExists',
                message: 'path not exists.',
                detail: 'path "plugins" did not found in current working directory.',
                extendedInfo: `Searched path: ${pluginsPath}`
            });
        }

        // load plugins and register them.
        fs.readdir(pluginsPath, (err, plugins) => {
            if (err) {
                throwError({
                    type: 'Application.FileSystemReadError',
                    message: err.message,
                    detail: `Error while reading path ${pluginsPath} (path exists).`,
                    extendedInfo: err.stack,
                    errorCode: err.code
                });
            }

            // register plugins
            plugins.forEach(plugin => {
                pluginManager.registerPlugin(this.server, this.app, plugin.substring(0, plugin.indexOf('.')));
            });
        });
    }

    /**
     * Register error route to catch synchronous errors and 
     * error which passed by calling next(err).
     */
    setErrorRoutes() {
       this.app.use((err, req, res, next) => {
           // pass error if headers already sent.
           if (res.headersSent) {
               return next(err);
           }

           // TODO: change behaviour via plugins (parse & log error instead of revealing to front-end).
           res.status(500).json({
               err: new AppError({
                   type: 'Applicaion.ErrorRoute',
                   message: 'Server error. Contact server administrator.',
                   detal: err.message,
                   extendedInfo: err.stack,
                   errorCode: err.code
               })
           });
       });
    }

    /**
     * Start listening to requests.
     */
    start() {
        // listen to coming requests
        const port = Number(this.config.port || process.env.PORT || 0);
        const host = this.config.host || '127.0.0.1';
        this.server.listen(port, host, () => {
            this.app.locals.url = `${this.app.locals.schema}://${host}:${port}`;
            log.info(`Server started on ${this.app.locals.url}`);
        });
    }
}

module.exports = Cluster;