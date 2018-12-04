const assert = require('assert');

describe('Seed config - Development setup', function() {
    before(function() {
        delete require.cache[require.resolve('./index')];
        delete require.cache[require.resolve('dotenv')];
        delete require.cache[require.resolve('./env/base.config')]; 
    })

    afterEach(function() {
        delete require.cache[require.resolve('./index')];
        delete require.cache[require.resolve('dotenv')];
        delete require.cache[require.resolve('./env/base.config')];
    })

    it('should have clusters option off and env option equals "development"', function() {
        // save original NODE_ENV variable
        const original = process.env.NODE_ENV;

        // set environment to development
        delete process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';

        let config = require('./index');

        // check that config object is in correct shape
        assert.equal(config.app.env, 'dev');

        // restore NODE_ENV to its original value.
        process.env.NODE_ENV = original;
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