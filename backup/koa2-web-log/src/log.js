const path = require('path')
const log4js = require('koa-log4')
const logDir = path.join(__dirname, '..', 'logs')
const config = require('./log4js')

try {
  require('fs').mkdirSync(logDir)
} catch (err) {
  if (err.code !== 'EEXIST') {
    console.error(`Could not set up log directory, error was: `, err);
    process.exit(1)
  }
}
log4js.configure(config)
const logger = log4js.getLogger('startup')

logger.info(`logs config finished!`)
