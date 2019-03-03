import * as Koa from 'koa';

const app = new Koa();

app.use(ctx => {
  ctx.body = 'Hello world';
});

module.exports = app;