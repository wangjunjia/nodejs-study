const Koa = require('koa')
const nunjucksViews = require('koa-nunjucks-promise')
const mount = require('koa-mount')
const static = require('koa-static')
const session = require('koa-session2')
const bodyParser = require('koa-bodyparser')
const log4js = require('koa-log4')
const Store = require('./store')

require('./log')

const logger = log4js.getLogger('app')
logger.info(`-------- step into koa -------------`)

const PORT = 3000
const app = new Koa()
const route = require('./router')

app.use(nunjucksViews(`${__dirname}/../views`, {
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
app.use(mount('/static', static(`${__dirname}/../public`)))
app.use(log4js.koaLogger(log4js.getLogger('http'), {level: 'auto'}))

app.use(bodyParser())
app.use(session({
  key: 'SESSIONID', // default: 'koa:sess'
  store: new Store(),
  maxAge: 5000, // 超时时间 单位秒（s）
}))

app.use(route.routes())
  .use(route.allowedMethods())

app.listen(PORT, () => {
  console.log(`Server started on http://127.0.0.1:${PORT}`)
})

module.exports = app