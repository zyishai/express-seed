const path = require('path');
const merge = require('lodash.merge');
const { getEnvironment, loadConfig } = require('./utils');

// load .env file.
const result = require('dotenv').config({
    path: path.resolve(process.cwd(), '.env') 
}); 

// check for errors in the parsed .env config file.
if (result.error) {
    throw result.error;
}

// load base & environment specific configuration files.
const baseConfig = loadConfig('base');
const envConfig = loadConfig(getEnvironment());

baseConfig.app.env = getEnvironment();

module.exports = merge(baseConfig, envConfig);