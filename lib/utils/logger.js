/**
 * success - log when operation that might fail is successful.
 * error - log when operation that might fail failed and cannot continue.
 * failure - log when step that might fail failed and skipped (operation continued).
 * info - log general information to the user (when app start listening for example).
 * debug - log information to check that a variable is defined or operation is happening.
 * log - default logger if no other log specified.
 */
const success = () => '\x1b[32m%s: \x1b[0m%s';
const error = () => '\x1b[31m%s: \x1b[0m%s';
const failure = () => '\x1b[33m%s: \x1b[0m%s';
const info = () => '\x1b[36m%s: \x1b[0m%s';
const debug = () => '\x1b[94m%s: \x1b[0m%s';
const log = () => '\x1b[37m%s: \x1b[0m%s';

const loggers = {
    success,
    error,
    failure,
    info,
    debug
};

module.exports = new Proxy(function() {}, {
    get(target, prop, receiver) {
        if (prop in loggers) {
            return function(...args) {
                console.log(loggers[prop](), new Date().toLocaleString(), ...args);
            }
        } else {
            return function(...args) {
                console.log(log(), new Date().toLocaleString(), ...args);
            };
        }
    },
    apply(target, thisArg, args) {
        console.log(log(), new Date().toLocaleString(), ...args);
    }
})