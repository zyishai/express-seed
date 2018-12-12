require('module-alias/register');
const cService = require('cluster-service');
const appConfig = require('./config').app;

// check if running in cluster or not.
if (!appConfig.cluster) {
    require('./lib/worker');
} else {
    cService.start({ config: appConfig.cluster });
}