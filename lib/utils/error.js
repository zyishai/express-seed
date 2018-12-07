const util = require('util');

/**
 * Factory method to create AppError instances.
 * 
 * @param {Object} settings - see `AppError` constructor for details.
 */
throwError = function(settings, context) {
    throw new AppError(settings, context || throwError);
}

/**
 * AppError constructor. Create custom error.
 * 
 * @param {object} settings - object with custom error definitions(type, message, detail, extendedInfo and errorCode).
 * @param {object} context - the context where the error is constructed to exclude from the error stack.
 */
function AppError(settings, context) {
    settings = settings || {};

    this.name = 'AppError';

    this.type = settings.type || 'Application';
    this.message = settings.message || 'An error occurred';
    this.detail = settings.detail || '';
    this.extendedInfo = settings.extendedInfo || '';
    this.errorCode = settings.errorCode || '';

    this.isAppError = true;

    Error.captureStackTrace(this, context || AppError);
}
util.inherits(AppError, Error);

module.exports.AppError = AppError;
module.exports.throwError = throwError;