"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const app = new Koa();
app.use(ctx => {
    ctx.body = 'Hello world';
});
module.exports = app;
//# sourceMappingURL=app.js.map