const Cluster = require('./express');
const config = require('../config');

const worker = new Cluster(config.app);
worker.createServer();
worker.setApplicationSettings();
worker.registerMiddlewares();
worker.loadRoutes();
worker.registerPlugins();
worker.setErrorRoutes();
worker.start();

module.exports = worker;