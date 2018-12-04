const path = require('path');
const fs = require('fs');

module.exports = {
    app: {
        clusters: true,
        compression: {
            level: 9
        },
        ssl: {
            key: fs.readFileSync(path.resolve('/Users/yishaizehavi/.local_ca_root/localhost_cert/server.key')),
            cert: fs.readFileSync(path.resolve('/Users/yishaizehavi/.local_ca_root/localhost_cert/server.crt'))
        }
    }
}