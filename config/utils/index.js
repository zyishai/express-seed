/**
 * Get the value of the current `NODE_ENV`.
 */
module.exports.getEnvironment = () => {
    if (['dev', 'development'].includes(process.env.NODE_ENV)) return 'dev';
    else if (['prod', 'production'].includes(process.env.NODE_ENV)) return 'prod';
    else return process.env.NODE_ENV || 'dev';
}

/**
 * Try to load config file with the specified `name`.
 * 
 * @param {string} name   environment name (e.g dev, prod, test etc).
 * @returns {module}   the module if it loaded successfully.
 * @throws {Error}   error from `require()` function.
 */
module.exports.loadConfig = (name) => {
    try {
        let configFile = require(`../env/${name}.config`);

        return configFile;
    } catch (err) {
        throw err;
    }
}