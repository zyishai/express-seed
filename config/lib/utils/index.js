/**
 * I'm not sure that I need this module.
 * First, why would I use synced version of glob pattern instead
 * of the regular async version?? Normally, I preffer the async version
 * because it doesn't block the system while it is running.
 * Second, whatever I'll choose to use, why would I need seperate module
 * for that?? Why not just import `glob` and use whatever method I want??
 *
 * This module might be good if I need a wrapper around glob..
 */

const glob = require('glob')

module.exports = {
  // get files from glob pattern
  getGlobbedPattern = (globPattern) => glob.sync(globPattern),

  // make environment variable required
  required = (envName) => process.env[envName] || process.exit(new Error(`${envName} environment variable is not found`))
}
