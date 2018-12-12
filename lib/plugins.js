const path = require('path');
const config = require('../config');

const PluginManager = {
    plugins: {},
    registerPlugin(server, app, name) {
        const plugin = require(path.join(process.cwd(), 'plugins', `${name}.js`));
        const ppo = plugin(server, app, config[name] || {});

        if (ppo) {
            this.plugins[name] = ppo;
        }
    },
    getService(name) {
        return this.plugins[name];
    }
};

module.exports = PluginManager;