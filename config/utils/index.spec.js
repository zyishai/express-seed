const assert = require('assert');
const utils = require('./index');
let originalNodeEnv;

describe('`getEnvironment()` function', function() {
    // save original value of NODE_ENV.
    before(function() {
        originalNodeEnv = process.env.NODE_ENV;
    })

    // restore NODE_ENV from original variable.
    after(function() {
        process.env.NODE_ENV = originalNodeEnv;
    })

    it('should set environment to "dev" as default', function() {
        // reset NODE_ENV to undefined
        delete process.env.NODE_ENV;

        let env = utils.getEnvironment();

        assert.equal(env, 'dev');
    })
    it('should set environment to "dev" when NODE_ENV=development', function() {
        // set NODE_ENV to development
        process.env.NODE_ENV = 'development';

        let env = utils.getEnvironment();

        assert.equal(env, 'dev');
    })
    it('should set environment to "prod" when NODE_ENV=production', function() {
        // set NODE_ENV to production
        process.env.NODE_ENV = 'production';

        let env = utils.getEnvironment();

        assert.equal(env, 'prod');
    })
    it('should set environment to "testing" when NODE_ENV=testing', function() {
        // set NODE_ENV to test
        process.env.NODE_ENV = 'testing';

        let env = utils.getEnvironment();

        assert.equal(env, 'testing')
    })
})

describe('`loadConfig()` function', function() {
    // save original value of NODE_ENV.
        before(function() {
        originalNodeEnv = process.env.NODE_ENV;
    })

    // restore NODE_ENV from original variable.
    after(function() {
        process.env.NODE_ENV = originalNodeEnv;
    })

    it('should throw an error if module name is empty', function() {
        assert.throws(utils.loadConfig, 'Empty name did not throws..');
    })
    it('should load development configurations if NODE_ENV=development', function() {
        // set NODE_ENV to development.
        process.env.NODE_ENV = 'development';

        assert.doesNotThrow(
            utils.loadConfig.bind(null, utils.getEnvironment())
        );

        const config = utils.loadConfig(utils.getEnvironment());

        assert.equal(config.clusters, false);
    })
    it('should throw an error if no matching configuration file found', function() {
        // set NODE_ENV to test.
        process.env.NODE_ENV = 'test';

        assert.throws(utils.loadConfig.bind(null, utils.getEnvironment()));
    })
})