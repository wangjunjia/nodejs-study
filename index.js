#!/usr/bin/env node

'use strict'

const program = require('commander')
const chalk = require('chalk')
const pkg= require('./package')
const log = console.log

const {createReactApp, createComponent, } = require('./cmd')

program
  .version(pkg.version)

program
  .command('new <projectName>')
  .description('use create-react-app create a app')
  .option('-n, --use-npm', 'Whether to use npm to download dependencies')
  .action(function(projectName, cmd) {
    const isUseNpm = Boolean(cmd.useNpm)
    createReactApp(projectName, isUseNpm)
  })

program
  .command('g')
  .description('Generate a component')
  .option('-c, --component-name <componentName>', 'The name of the component')
  .option('--no-folder', 'Whether the component have not it is own folder')
  .option('-p, --pure-component', 'Wheter the component is a extend from React PureCompoent')
  .option('-s, --stateless', 'Whether the component is a extend from PureComponent')
  .action(function(cmd) {
    if (!cmd.componentName) {
      log(chalk.red(`error: missing required argument 'componentName'`))
      process.exit(1)
    }
    createComponent(cmd.componentName, cmd.folder, cmd.stateless, cmd.pureComponent)
  })

program
  .allowUnknownOption()
  .action(function() {
    log(chalk.yellow('Invalid command\n'))
    program.outputHelp()
  }) 

program.parse(process.argv)
