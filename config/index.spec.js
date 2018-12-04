const assert = require('assert');

describe('Seed config - Development setup', function() {
    afterEach(function() {
        delete require.cache[require.resolve('./index')];
        delete require.cache[require.resolve('dotenv')];
        delete require.cache[require.resolve('./env/base.config')];
    })

    it('should have clusters option off and env option equals "development"', function() {
        // set environment to development
        process.env.NODE_ENV = 'development';

        let config = require('./index');

        // check that config object is in correct shape
        assert.equal(config.app.env, 'dev');
    })
})

describe('Seed config - Production setup', function() {
    afterEach(function() {
        delete require.cache[require.resolve('./index')];
        delete require.cache[require.resolve('dotenv')];
        delete require.cache[require.resolve('./env/base.config')];
    })

    it('should have clusters option on and env option equals "production"', function() {
        // set environment to production
        process.env.NODE_ENV = 'production';

        let config = require('./index');

        // check that config object is in correct shape
        assert.equal(config.app.env, 'prod');
    })
})