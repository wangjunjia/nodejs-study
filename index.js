const chalk = require('chalk')
const rl = require('readline')
const lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const args = process.argv
const adapter = new FileSync('db.json')
const db = lowdb(adapter)
db.defaults({ todos: [] }).write()

args.unshift('todos') // just node index.js xxx replace node index

const usageText = `todo helps you manage you todo tasks.

usage:
  todo <command>

  commands can be:

  new:      used to create a new todo
  get:      used to retrieve your todos
  complete: used to mark a todo as complete
  help:     used to print the usage guide
`

const errorLog = (error) => {
  console.log(chalk.red(error))
}

const prompt = (question) => {
  const r = rl.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  })
  return new Promise((resolve, reject) => {
    r.question(question, answer => {
      r.close()
      resolve(answer)
    })
  })
}

const usage = () => {
  console.log(usageText)
}

const newTodo = async () => {
  const q = chalk.blue('Type in your todo\n')
  let todo = await prompt(q)
  console.log(todo)
  if (todo.trim().length) {
    db.get('todos')
      .push({
        title: todo,
        complete: false
      })
      .write()
  } else {
    errorLog('invalid input')
  }
}

const getTodo = async () => {
  const todoList = db.get('todos').value()
  todoList.forEach((todo, idx) => {
    let text = `${idx + 1}. ${todo.title}`
    if (todo.complete) {
      text += ' ✔'
    }
    console.log(chalk.strikethrough(text))
  })
}

const completeTodo = async () => {
  if (args[2] !== 'complete') {
    errorLog('invalid number of arguments passed for complete command')
    usage()
    return
  }
  let n = Number(args[3])
  if (isNaN(n)) {
    errorLog('please provide a valid number for complete command')
    usage()
    return
  }
  const todoList = db.get('todos').value()
  if (n > todoList.length) {
    errorLog('invalid number passed for complete command.')
    usage()
    return
  }
  db.set(`todos[${n - 1}].complete`, true).write()
  db.remove()
}

const deleteTodo = async () => {
  if (args[2] !== 'delete') {
    errorLog('invalid number of arguments passed for delete command')
    usage()
    return
  }
  let n = Number(args[3])
  if (isNaN(n)) {
    errorLog('please provide a valid number for delete command')
    usage()
    return
  }
  const todoList = db.get('todos').value()
  if (n > todoList.length) {
    errorLog('invalid number passed for delete command.')
    usage()
    return
  }
  db.get('todos').remove(`todos[${n - 1}]`).write()
}

const cmds = {
  new: newTodo,
  get: getTodo,
  complete: completeTodo,
  delete: deleteTodo,
  help: usage
}

if (args.length < 3) {
  errorLog(`only one argument can be accepted`)
  usage()
  process.exit()
}

if (!cmds[args[2]]) {
  errorLog('invalid command passed')
  cmds.help()
  process.exit()
}

cmds[args[2]]()
