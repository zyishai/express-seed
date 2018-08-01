const {readdir} = require('fs')
const {join} = require('path')
const {promisify} = require('util')

const readdirAsync = promisify(readdir)

module.exports = (app) => {  
  let routesDirPath = join(__dirname, 'routes')

  try {
    const routes = readdirAsync(routesDirPath)

    for (let route of routes) {
      require(path.join(routesDirPath, route))(app)
    }
  } catch (err) {
    err.path = routesDirPath
    throw err
  }  
}
