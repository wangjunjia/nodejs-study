const path = require('path')
const inquirer = require('inquirer')
const chalk = require('chalk')
const figlet = require('figlet')
const shell = require('shelljs')

const questions = [
  {
    name: 'FILENAME',
    type: 'input',
    message: 'What is the name of the file without extension?',
  },
  {
    name: 'EXTENSION',
    type: 'list',
    message: 'What is the file extension?',
    choices: ['.rb', '.js', '.php', '.css'],
    filter(val) {
      return val.split('.')[1]
    }
  },
]

const init = () => {
  console.log(
    chalk.green(
      figlet.textSync("Node f*cking JS", {
        font: "Ghost",
        horizontalLayout: "default",
        verticalLayout: "default"
      })
    )
  );
}

const askQuestions = () => {
  return inquirer.prompt(questions)
}

const createFile = (filename, extension) => {
  const filePath = `${process.cwd()}${path.sep}${filename}.${extension}`
  shell.touch(filePath)
  return filePath
}

const success = (filePath) => {
  console.log(chalk.white.bgGreen.bold(`Done! File created at ${filePath}`));
}

const run = async () => {
  // show cli introduction
  init()
  // ask questions 
  const answers = await askQuestions()
  const { FILENAME, EXTENSION } = answers
  console.log(FILENAME, EXTENSION);
  // create the file
  let filePath = createFile(FILENAME, EXTENSION)
  // show result message
  success(filePath);
}

run()