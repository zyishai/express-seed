const path = require('path');
const fs = require('fs');

module.exports = {
    app: {
        clusters: {
            worker: path.join(process.cwd(), 'lib', 'worker.js'),
            accessKey: process.env.ACCESS_KEY || '1234'
        },
        compression: {
            level: 9
        },
        ssl: {
            key: fs.readFileSync(path.resolve('/Users/yishaizehavi/.local_ca_root/localhost_cert/server.key')),
            cert: fs.readFileSync(path.resolve('/Users/yishaizehavi/.local_ca_root/localhost_cert/server.crt'))
        }
    }
}