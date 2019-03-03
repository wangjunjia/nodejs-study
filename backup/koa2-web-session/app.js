const Koa = require('koa')
const KoaRouter = require('koa-router')
const nunjucksViews = require('koa-nunjucks-promise')
const mount = require('koa-mount')
const static = require('koa-static')
const session = require('koa-session2')
const Store = require('./store')

const PORT = 3000
const app = new Koa()
const route = new KoaRouter()

app.use(nunjucksViews(`${__dirname}/views`, {
  ext: 'html',
  noCache: true,
  watch: true,
  filters: {
    json(data) {
      return JSON.stringify(data, null, 2)
    }
  },
  globals: { // 全局变量
    // staticPath: 'static'
  }
}))

// 静态文件路径，必须在 模版 之后
app.use(mount('/static', static(`${__dirname}/public`)))

app.use(session({
  key: 'SESSIONID', // default: 'koa:sess'
  store: new Store(),
  maxAge: 5000, // 超时时间 单位秒（s）
}))

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.body = { message: err.message }
    ctx.stats = err.status || 500
  }
})

route.get('/', async ctx => {
  console.log(ctx.session.view )
  if (ctx.session.view === undefined) {
    ctx.session.view = 1
  } else {
    ctx.session.view += 1
  }
  console.log(`view num is ${ctx.session.view}`);
  
  ctx.render('index', {
    title: 'Koa2Web',
    content: 'hello koa2 web'
  })
})

route.get('/route/test', async ctx => {
  ctx.body ='hello world'
})

app.use(route.routes())
  .use(route.allowedMethods())

app.listen(PORT, () => {
  console.log(`Server started on http://127.0.0.1:${PORT}`)
})

module.exports = app