const mongoose = require('mongoose')
const dbConfig = require('@app-config').db.mongo

module.exports = {
  connect: function() {
    mongoose.Promise = global.Promise

    mongoose.set('debug', dbConfig.debug)
    return mongoose.connect(dbConfig.uri, dbConfig.options)
  },
  disconnect: function() {
    // disconnect all connections in the connection pool,
    // and also close the connection of the session.
    return mongoose.disconnect()
  }
}
