const Koa = require('koa')
const KoaRouter = require('koa-router')
const nunjucksViews = require('koa-nunjucks-promise')
const mount = require('koa-mount')
const static = require('koa-static')
const app = new Koa()

const PORT = 3000

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
  globals: {
    // staticPath: 'static'
  }
}))

app.use(mount('/static', static(`${__dirname}/public`)))

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.body = { message: err.message }
    ctx.stats = err.status || 500
  }
})

route.get('/', async ctx => {
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