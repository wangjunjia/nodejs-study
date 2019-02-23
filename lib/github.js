const Octokit = require('@octokit/rest')()
const Configstore = require('configstore')
const pkg = require('../package.json')
const _ = require('lodash')
const Spinner = require('clui').Spinner
const chalk = require('chalk')

const inquirer = require('./inquirer')
const conf = new Configstore(pkg.name)

module.exports = {
  getInstance () {
    return Octokit
  },

  githubAuth (token) {
    Octokit.authenticate({
      type: 'oauth',
      token: token
    })
  },

  getStoredGitHubToken () {
    return conf.get('github.token')
  },

  async setGitHubCredentials () {
    const credentials = await inquirer.askGitHubCredentials()
    Octokit.authenticate(_.extend({ type: 'basic' }, credentials))
  },

  async registerNewToken () {
    const status = new Spinner('Authenticating you, please wait...')
    status.start()

    try {
      const response = await Octokit.authorization.create({
        scopes: ['user', 'public_repo', 'repo', 'repo:status'],
        note: 'ginits, the command-line tool for initalizing Git repos',
      })
      const token = response.data.token
      if (token) {
        conf.set('github.token', token)
      } else {
        throw new Error('Missing Token', 'GitHub token was not found in the response')
      }
    } catch (error) {
      throw error
    } finally {
      status.stop()
    }
  },

  async hasAccessToken () {
    const status = new Spinner('Authenticating you, please wait...')
    status.start()

    try {
      const response = await Octokit.authorization.getAll()
      const accessToken = _.find(response.data, (row) => {
        if (row.note) {
          return row.note.indexOf('ginit') !== -1
        }
      })
      return accessToken
    } catch (err) {
      throw err
    } finally {
      status.stop()
    }
  },

  async regenerateNewToken (id) {
    const tokenUrl = 'https://github.com/settings/tokens/' + id
    console.log('Please visit ' + chalk.underline.blue.bold(tokenUrl) + ' and click the ' + chalk.red.bold('Regenerate Token Button.\n'))
    const input = await inquirer.askRegeneratedToken()
    if (input) {
      conf.set('github.token', input.token)
      return input.token
    }
  }

}