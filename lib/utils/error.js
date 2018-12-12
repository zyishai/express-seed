const util = require('util');
const logger = require('./logger');

/**
 * Factory method to create AppError instances.
 * 
 * @param {Object} settings - see `AppError` constructor for details.
 */
const throwError = function(settings, context) {
    settings = settings || {};
    const stack = {};
    Error.captureStackTrace(stack, context || this);

    logger.error('Error occurred:');
    logger.error(`Type: ${settings.type}`);
    logger.error(`Message: ${settings.message}`);
    logger.error(`Detail: ${settings.detail}`);
    logger.error(`Extended Info: ${settings.extendedInfo}`);
    logger.error(`Code: ${settings.errorCode}`);
    logger.error(`Stack: ${JSON.stringify(stack, null, 2)}`);
    
    const err = new AppError(settings, context || this);
    throw err;
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