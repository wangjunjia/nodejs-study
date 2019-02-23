const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')

const files = require('./lib/files')
const github = require('./lib/github')
const repo = require('./lib/repo')

clear()
console.log(chalk.yellow(figlet.textSync('Ginit', { horizontalLayout: 'full' })))

if (files.directoryExists('.git')) {
  console.log(chalk.red('Already a git repository!'))
  process.exit()
}

const getGitHubToken = async () => {
  let token = github.getStoredGitHubToken()
  if (token) {
    return token
  }

  await github.setGitHubCredentials()

  // Check if access token for ginit was registered
  const accessToken = await github.hasAccessToken()
  if (accessToken) {
    console.log(chalk.yellow('An existing access token has been found!'))
    // ask user to regenerate a new token
    token = await github.regenerateNewToken(accessToken.id)
    return token
  }

  token = await github.registerNewToken()
  return token
}

const run = async () => {
  try {
    // Retrieve & Set Authentication Token
    let token = await getGitHubToken()
    github.githubAuth(token)

    // Create remote repository
    const url = await repo.createRemoteRepo()

    // Create .gitignore file
    await repo.createGitignore()

    // Set up local repository and push to remote
    const done = await repo.setupRepo(url)
    if (done) {
      console.log(chalk.green('All done!'))
    }
  } catch (error) {
    switch (error.code) {
      case 401:
        console.log(chalk.red('Couldn\'t log you in. Please provide correct credentials/token.'))
        break
      case 422:
        console.log(chalk.red('There already exists a remote repository with the same name'))
        break
      default:
        console.log(error)
    }
  }

}

run()