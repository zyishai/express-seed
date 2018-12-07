const assert = require('assert');
const { throwError, AppError } = require('./error');

describe('Error utility - `AppError` constructor', function() {
    it('should create custom error with default settings', function() {
        const err = new AppError();

        assert(err.isAppError);
        assert.equal(err.name, 'AppError');
        assert.equal(err.type, 'Application');
        assert.equal(err.message, 'An error occurred');
        assert.equal(err.detail, '');
        assert.equal(err.extendedInfo, '');
        assert.equal(err.errorCode, '');
    });
    it('should create custom error with custom settings', function() {
        const customSettings = {
            type: 'App.PluginError',
            message: 'Plugin could not be loaded',
            detail: 'Settings did not found',
            extendedInfo: 'trace.settings is undefined'
        };
        const err = new AppError(customSettings);

        assert(err.isAppError);
        assert.equal(err.name, 'AppError');
        assert.equal(err.type, customSettings.type);
        assert.equal(err.message, customSettings.message);
        assert.equal(err.detail, customSettings.detail);
        assert.equal(err.extendedInfo, customSettings.extendedInfo);
        assert.equal(err.errorCode, '');
    })
});

describe('Error utility - `throwError()` function', function() {
    it('should throw an error with default settings', function() {
        assert.throws(throwError);

        try {
            throwError();
        } catch (err) {
            console.log(err);
            assert(err.isAppError);
            assert.equal(err.type, 'Application');
        }
    });
    it('should throw an error with custom settings', function() {
        const customSettings = {
            type: 'Demo'
        };

        try {
            throwError(customSettings);
        } catch (err) {
            assert.equal(err.type, customSettings.type);
        }
    })
});
