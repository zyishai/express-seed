# Resources for building Express-Seed

## Session Handling
- Session will be implemented as a plugin. Not built in.
- [Stop using JWT for sessions](http://cryto.net/~joepie91/blog/2016/06/13/stop-using-jwt-for-sessions/).

## Cluster Services
- [cluster-service](https://www.npmjs.com/package/cluster-service)

## Error Handling & Parsing
- Created custom error object, inspired by [this](https://www.bennadel.com/blog/2828-creating-custom-error-objects-in-node-js-with-error-capturestacktrace.htm) article.
- There are two packages that seems to parse stack trace quite good:
    - [node-stack-trace](https://github.com/felixge/node-stack-trace).
    - [error-stack-parser](https://github.com/stacktracejs/error-stack-parser).
- Use these two and custom implementation to implement error parsing and logging plugin.
- Error parsing won't be included in Express-Seed core, but as a plugin.