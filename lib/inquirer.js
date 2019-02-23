const inquirer = require('inquirer')
const minimist = require('minimist')
const files = require('./files')

const githubCredentialsQuestions = [
  {
    name: 'username',
    type: 'input',
    message: 'Enter your GitHub username or e-mail address:',
    validate(val) {
      return val.length > 0 || 'Please enter your username or e-mail address.'
    }
  },
  {
    name: 'password',
    type: 'password',
    message: 'Enter your password:',
    validate(val) {
      return val.length > 0 || 'Please enter your password.'
    }
  }
]

const regeneratedTokenQuestions = [
  {
    name: 'token',
    type: 'input',
    message: 'Enter your new regenerated token:',
    validate (value) {
      return value.length > 0 || 'Please enter your new regenerated token:.'
    }
  }
]

let args = { _: [] }

const repositoryQuestions = [
  {
    type: 'input',
    name: 'name',
    message: 'Enter a name for the repository:',
    default: args._[0] || files.getCurrentDirectoryBase(),
    validate(val) {
      return val.length > 0 || 'Please enter a name for the repository.'
    }
  },
  {
    type: 'input',
    name: 'description',
    default: args._[1] || null,
    message: 'Optionally enter a description of the repository:'
  },
  {
    type: 'list',
    name: 'visibility',
    message: 'Public or private:',
    choices: [ 'public', 'private' ],
    default: 'public'
  }
]

let fileList = []

const ignoreQuestions = [
  {
    type: 'checkbox',
    name: 'ignore',
    message: 'Select the files and/or folders you wish to ignore:',
    choices: fileList,
    default: ['node_modules', 'bower_components']
  }
]

module.exports = {
  askGitHubCredentials () {
    return inquirer.prompt(githubCredentialsQuestions)
  },

  askRegeneratedToken () {
    return inquirer.prompt(regeneratedTokenQuestions)
  },

  askRepoDetails () {
    args = minimist(process.argv.slice(2))
    return inquirer.prompt(repositoryQuestions)
  },

  askIgnoreFiles (filelist) {
    fileList = filelist
    return inquirer.prompt(ignoreQuestions)
  }
}
