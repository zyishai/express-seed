const fs = require('fs')
const path = require('path')

module.exports = (app) => {
  return new Promise((resolve, reject) => {
    let routesDirPath = path.join(__dirname, 'routes')

    // load all routes to app
    fs.readdir(routesDirPath, (err, routes) => {
      if (err) {
        err.path = routesDirPath
        reject(err)
      }

      for (let route of routes) {
        require(path.join(routesDirPath, route))(app)
      }

      resolve()
    })
  })
}
