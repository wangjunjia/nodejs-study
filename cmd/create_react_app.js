const spawn = require('cross-spawn')
const chalk = require('chalk')
const log = console.log


function createReactApp(projectName, isUseNpm) {
  let args = ['create-react-app', projectName]
  isUseNpm && args.push('--use-npm')
  args.push('-registry https://registry.npm.taobao.org ')

  spawn.sync('npx', args, { stdio: 'inherit' })
  log(chalk.green(`project ${projectName} was successfully generated!`))
}


module.exports = {
  createReactApp,
}