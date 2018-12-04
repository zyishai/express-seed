const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const compression = require('compression');
const bodyParser = require('body-parser');
const { throwError } = require('./error')('MIDDLEWARE_ERROR');
const log = require('./logger');

/**
 * Register serve-favicon middleware to express app.
 */
module.exports.registerFaviconMiddleware = function(app, config) {
    // disable middleware
    if (!config) {
        log('Favicon middleware disabled for this setup');
        return app;
    }

    // custom configurations
    if (typeof (config) === 'object') {
        // validate required options and their types.
        if (!config.path || typeof (config.path) !== 'string') {
            throwError('favicon "path" must be a string!');
        }
        if (config.name && typeof (config.name) !== 'string') {
            throwError('favicon "name" must be a string!');
        }

        app.use(favicon(config.path, config.name || 'favicon.ico'))
    } else { // register with default configurations
        app.use(favicon(path.join(process.cwd(), 'public', 'assets', 'favicon.ico')));
    }

    log(`Favicon middleware registered in ${config.path || 'public/assets'}/${config.name || 'favicon.ico'}`);
    return app;
}

/**
 * Register compression middleware to express app.
 */
module.exports.registerCompressionMiddleware = function(app, config) {
    if (!config) {
        log('Compression middleware disabled for this setup');
        return app;
    }

    // custom configurations.
    if (typeof (config) === 'object') {
        app.use(compression(config));
    } else { // register middleware with default configurations.
        app.use(compression());
    }

    log('Compression middleware registered successfully');
    return app;
}

/**
 * Register body-parser middleware to express app.
 */
module.exports.registerBodyParserMiddleware = function(app, config) {
    if (!config) {
        log('Body parser middleware disabled for this setup');
        return app;
    }

    // custom configurations.
    if (typeof (config) === 'object') {
        Object.keys(config).forEach(key => {
            let opts = config[key];

            if (!bodyParser[key]) {
                throwError(`${key} method does not exists on body-parser!`);
            }
            if (!opts) {
                throwError(`No configurations for ${key}`);
            }

            app.use(bodyParser[key](opts));
        });
    } else { // register middleware with default configurations.
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
    }

    log('Body parser middleware registered successfully');
    return app;
}

/**
 * Register static content middleware to express app.
 */
module.exports.registerStaticContentMiddleware = function(app, config) {
    // disable middleware.
    if (!config) {
        log('Static content middleware disabled for this setup');
        return app;
    }

    // custom configurations.
    if (typeof (config) === 'object') {
        Object.keys(config).forEach(_url => {
            const opts = config[_url];

            // don't register specific url.
            if (opts.enable === false) return;

            // validate required options and type of options.
            if (!opts.path) {
                throwError(`"path" for ${_url} did not specified!`);
            } else if (typeof (opts.path) !== 'string') {
                throwError(`"path" for ${_url} should be a string.`);
            }
            if (opts.options && typeof (opts.options) !== 'object') {
                throwError(`Options for ${_url} should be an object.`);
            }

            app.use(`/${_url}`, express.static(opts.path, opts.options || {}));
        })
    } else { // register with default configurations.
        app.use(express.static(path.join(process.cwd(), 'public')));
    }

    log('Static content middleware registered successfully');
    return app;
}