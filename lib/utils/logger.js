const debug = require('debug');
const config = require('../../config');

const colors = {
    green: 32,
    red: 40,
    orange: 27,
    blue: 3,
    cyan: 26
};

/**
 * success - log when operation that might fail is successful.
 * error - log when operation that might fail failed and cannot continue.
 * failure - log when step that might fail failed and skipped (operation continued).
 * info - log general information to the user (when app start listening for example).
 */
const success = debug('success');
const error = debug('error');
const failure = debug('failure');
const info = debug('info');

success.color = debug.colors[colors.green];
error.color = debug.colors[colors.red];
failure.color = debug.colors[colors.orange];
info.color = debug.colors[colors.cyan];

module.exports = (function(original) {
    return function (data) {
        if (!config.app.debug) return;
        original('\x1b[34m%s: \x1b[0m%s', new Date().toLocaleString(), data);
    }
})(console.log);
// module.exports = {
//     success,
//     error,
//     failure,
//     info
// }

// module.exports.debug = debug;