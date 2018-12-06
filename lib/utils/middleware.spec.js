const assert = require('assert');
const path = require('path');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

var appStub = sinon.stub({ use: () => {} });
var faviconStub = sinon.stub();
var compressionStub = sinon.stub();
var bodyParserStub = sinon.stub({ json:()=>{}, urlencoded:()=>{} });
var expressStub = sinon.stub({ static:()=>{} });
var middlewares = null;

// spying on express middlewares
before(() => {
    // faviconStub = sinon.stub();
    // compressionStub = sinon.stub();
    middlewares = proxyquire('./middleware', {
        'serve-favicon': faviconStub,
        'compression': compressionStub,
        'body-parser': bodyParserStub,
        'express': expressStub
    });
});

// restore original middleware methods
after(() => {
    sinon.restore();
});

describe('Middleware utility - `registerFaviconMiddleware()` function', function() {
    afterEach(function() {
        faviconStub.resetHistory();
        appStub.use.reset();
    });

    it('should not load if no config specified', function() {
        middlewares.registerFaviconMiddleware(appStub, undefined);

        assert(faviconStub.notCalled);
    });
    it('should load with default settings', function() {
        middlewares.registerFaviconMiddleware(appStub, true);
        
        assert(appStub.use.calledOnce);
        assert(faviconStub.calledOnce);
        assert(faviconStub.calledWith(path.join(process.cwd(), 'public', 'assets', 'favicon.ico')));
    });
    it('should throw if "path" is not valid or missing', function() {
        assert.throws(middlewares.registerFaviconMiddleware.bind(middlewares, appStub, { name: 'test.ico' }));
    });
    it('shoud throw if "name" is invalid or missing', function() {
        assert.throws(middlewares.registerFaviconMiddleware.bind(middlewares, appStub, { path: '/temp' })); 
    });
    it('should load with custom configurations', function() {
        middlewares.registerFaviconMiddleware(appStub, { path: process.cwd(), name: 'test.ico' });

        assert(appStub.use.calledOnce);
        assert(faviconStub.calledWith(process.cwd(), 'test.ico'));
    });
});

describe('Middleware utility - `registerCompressionMiddleware()` function', function() {
    afterEach(function() {
        compressionStub.resetHistory();
        appStub.use.reset();
    });
    it('should not load if no config specified', function() {
        middlewares.registerCompressionMiddleware(appStub, false);

        assert(compressionStub.notCalled);
    });
    it('should load with default configurations', function() {
        middlewares.registerCompressionMiddleware(appStub, true);

        assert(appStub.use.calledOnce);
        assert(compressionStub.calledOnce);
        assert(appStub.use.calledWith(compressionStub()));
    });
    it('should load with custom configurations', function() {
        const config = { test: true };

        middlewares.registerCompressionMiddleware(appStub, config);

        assert(appStub.use.calledOnce);
        assert(compressionStub.calledOnce);
        assert(compressionStub.calledWith(config));
    });
});

describe('Middleware utility - `registerBodyParserMiddleware()` function', function () {
    afterEach(function() {
        bodyParserStub.json.resetHistory();
        bodyParserStub.urlencoded.resetHistory();
        appStub.use.reset();
    });
    it('should not load if no config specified', function() {
        middlewares.registerBodyParserMiddleware(appStub, null);

        assert(appStub.use.notCalled);
    });
    it('should load with default configurations', function() {
        const internalDefaultConfig = { extended: true };
        middlewares.registerBodyParserMiddleware(appStub, true);

        assert(appStub.use.calledTwice);
        assert(bodyParserStub.json.calledOnce);
        assert(bodyParserStub.urlencoded.calledOnce);
        assert(bodyParserStub.urlencoded.calledWith(internalDefaultConfig));
    });
    it('should throw if unknown key specified', function() {
        const unknownKeyConfig = { test: {} };

        assert.throws(middlewares.registerBodyParserMiddleware.bind(middlewares, appStub, unknownKeyConfig));
    });
    it('should throw if options for key are invalid', function() {
        const invalidConfig = { json: null };

        assert.throws(middlewares.registerBodyParserMiddleware.bind(middlewares, appStub, invalidConfig));
    });
    it('should load with custom configurations', function() {
        const jsonConfig = { test: true };
        const customConfig = { json: jsonConfig };

        middlewares.registerBodyParserMiddleware(appStub, customConfig);

        assert(appStub.use.calledOnce);
        assert(bodyParserStub.json.calledOnce);
        assert(bodyParserStub.json.calledWith(jsonConfig));
    });
});

describe('Middleware utility - `registerStaticContentMiddleware()` function', function () {
    afterEach(function() {
        appStub.use.reset();
        expressStub.static.resetHistory();
    });
    it('should not load if no config specified', function() {
        middlewares.registerStaticContentMiddleware(appStub);

        assert(appStub.use.notCalled);
    });
    it('should load with default configurations', function() {
        const defaultPath = path.join(process.cwd(), 'public');

        middlewares.registerStaticContentMiddleware(appStub, true);

        assert(appStub.use.calledOnce);
        assert(expressStub.static.calledOnce);
        assert(expressStub.static.calledWith(defaultPath));
        assert(appStub.use.calledWith(expressStub.static(defaultPath)));
    });
    it('should throw if "path" is invalid or missing', function() {
        const config = {
            'views': {}
        }

        assert.throws(middlewares.registerStaticContentMiddleware.bind(middlewares, appStub, config));
    });
    it('should throw if "path" is not a string', function() {
        const config = {
            'views': {
                path: 29
            }
        }

        assert.throws(middlewares.registerStaticContentMiddleware.bind(middlewares, appStub, config));
    });
    it('should throw if "options" is not an object', function() {
        const config = {
            'views': {
                path: 'public',
                options: 'invalid'
            }
        }

        assert.throws(middlewares.registerStaticContentMiddleware.bind(middlewares, appStub, config));
    });
    it('should be able to disable specific urls', function() {
        const config = {
            js: {
                path: 'public/js'
            },
            css: {
                enable: false
            }
        }

        middlewares.registerStaticContentMiddleware(appStub, config);

        assert(appStub.use.calledOnce);
        assert(expressStub.static.calledOnce);
        assert(expressStub.static.calledWith('public/js'));
    });
    it('should load with custom configurations', function() {
        const config = {
            js: {
                path: 'public/js',
                options: {
                    debug: true
                }
            },
            css: {
                path: 'public/css'
            }
        }

        middlewares.registerStaticContentMiddleware(appStub, config);

        assert(appStub.use.calledTwice);
        assert(appStub.use.calledWith('/js'));
        assert(appStub.use.calledWith('/css'));
        assert(expressStub.static.calledTwice);
        assert(expressStub.static.calledWith('public/js', { debug: true }));
        assert(expressStub.static.calledWith('public/css'));
    });
});