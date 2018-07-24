module.exports = (logger) => {
  logger.successStream = {
    write(chuck, encoding) {
      // trim line breaks
      chuck = chuck.replace(/\n/g, '')
      logger.success(chuck)
    }
  }
  logger.failStream = {
    write(chuck, encoding) {
      // trim line breaks
      chuck = chuck.replace(/\n/g, '')
      logger.fail(chuck)
    }
  }
}
