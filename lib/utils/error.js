/**
 * Throw an error.
 * 
 * @param {String} msg error message
 */
module.exports = (type) => ({
    throwError: function(msg) {
        const err = new Error(`${type}: ${msg}`);
        Error.captureStackTrace(err, this);
        throw err;
    }
});