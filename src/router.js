const fs = require('fs')
const log4js = require('koa-log4')
const KoaRoute = require('koa-router')

const route = new KoaRoute()
const logger = log4js.getLogger('router')

let filepath = './mock/user.json'
let readFromFile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, (err, data) => {
      if (err) {
        reject(err)
      } 
      resolve(data)
    })
  })
}

let writeToFile = (content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, content, (err) => {
      if (err) {
        reject(err)
      } 
      resolve({ state: 'ok' })
    })
  })
}

route.get('/', async (ctx) => {
  logger.debug(' this is test log')
  if (ctx.session.view === undefined) {
    ctx.session.view === 0
  } else {
    ctx.session.view += 1
  }
  console.log('viewNum', ctx.session.view)
  return ctx.render('index', {
    title: 'Koa2 Web',
    content: 'hello koa2 '
  })
})

route.get('/api/user', async (ctx, next) => {
  try {
    let users = JSON.parse(await readFromFile())
    ctx.body = JSON.stringify({status: 'success', data: users})
  } catch (err) {
    logger.error('error', err)
    ctx.status = 500
    ctx.body = JSON.stringify({status: 'failed'})
  }
})

route.post('/api/user', async (ctx, next) => {
  let newUser = {}
  newUser.name = ctx.request.body.name
  newUser.age = ctx.request.body.age
  try {
    let users = JSON.parse(await readFromFile())
    users.push(newUser)
    await writeToFile(JSON.stringify(users))
    ctx.body = JSON.stringify({status: 'success'})
  } catch (err) {
    logger.error('error', err)
    ctx.status = 500
    ctx.body = JSON.stringify({status: 'failed'})
  }
})

route.patch('/api/user/:name', async (ctx, next) => {
  let name = ctx.params.name
  let age = ctx.request.body.age
  try {
    let users = JSON.parse(await readFromFile())
    for (let i = 0, len = users.length; i < len; i++) {
      if (users[i].name === name) {
        users[i].age = age
        break
      }
    }
    await writeToFile(JSON.stringify(users))
    ctx.body = JSON.stringify({status: 'success'})
  } catch (err) {
    logger.error('error', err)
    ctx.status = 500
    ctx.body = JSON.stringify({status: 'failed'})
  }
})

route.del('/api/user/:name', async (ctx, next) => {
  let name = ctx.params.name
  try {
    let users = JSON.parse(await readFromFile())
    users = users.filter(it => it.name != name)
    await writeToFile(JSON.stringify(users))
    ctx.body = JSON.stringify({status: 'success'})
  } catch (err) {
    logger.error('error', err)
    ctx.status = 500
    ctx.body = JSON.stringify({status: 'failed'})
  }
})

module.exports = route

