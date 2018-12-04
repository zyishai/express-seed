const assert = require('assert');
const error = require('./error');

describe('Error utility - default throwing', function() {
    it('should throw an error', function() {
        const demoError = error('DEMO');

        assert.throws(() => demoError.throwError('just a demo'));
    })
    
    it('should have "DEMO" type', function() {
        const demoError = error('DEMO');

        try {
            demoError.throwError('just a demo');
        } catch (err) {
            assert.ok(err.message.startsWith('DEMO'));
        }
    })
})