const minimist = require('minimist')
const error = require('./utils/error')

const cmds = {
  today: './cmds/today',
  forecast: './cmds/forecast',
  version: './cmds/version',
  help: './cmds/help',
}

module.exports = () => {
  let args = minimist(process.argv.slice(2))
  let cmd = args._[0]

  if (args.version || args.v) {
    cmd = 'version'
  }

  if (args.help || args.h) {
    cmd = 'help'
  }

  if (cmds[cmd]) {
    require(cmds[cmd])(args)
  } else {
    error(`"${cmd}" is not a valid command!`, true)
  }
}