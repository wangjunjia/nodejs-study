
const http = require("http");
const assert = require("assert");
const log = console.log.bind(console)

/** 反向代理中间件 */
function reverseProxy(servers) {
  assert(Array.isArray(servers), "servers 必须是数组");
  assert(servers.length > 0, "servers 的长度必须大于 0");

  // 解析服务器地址，生成 hostname 和 port
  const _servers = servers.map(str => {
    const s = str.split(":");
    return { hostname: s[0], port: s[1] || "80" };
  });

  // 获取一个后端服务器，顺序循环
  let _serverIndex = 0;
  function getTarget() {
    const t = _servers[_serverIndex++];
    if (_serverIndex >= _servers.length) {
      _serverIndex = 0;
    }
    return t;
  }

  // 生成监听 error 事件函数，出错时响应 500
  function bindError(req, res, id) {
    return function (err) {
      const msg = String(err.stack || err);
      log("[%s] 发生错误: %s", id, msg);
      if (!res.headersSent) {
        res.writeHead(500, { "content-type": "text/plain" });
      }
      res.end(msg);
    };
  }

  return function proxy(req, res) {
    // 生成代理请求信息
    const target = getTarget();
    const info = {
      ...target,
      method: req.method,
      path: req.url,
      headers: req.headers
    };

    const id = `${req.method} ${req.url} => ${target.hostname}:${target.port}`;
    log("[%s] 代理请求", id);

    // 发送代理请求
    const req2 = http.request(info, res2 => {
      res2.on("error", bindError(req, res, id));
      log("[%s] 响应: %s", id, res2.statusCode);
      res.writeHead(res2.statusCode, res2.headers);
      res2.pipe(res);
    });
    req.pipe(req2);
    req2.on("error", bindError(req, res, id));
  };
};


http.createServer(reverseProxy(['localhost:5000']))
  .listen(3000, 'localhost', (err) => {
    log('Server run http://localhost:3000')
  })


http.createServer((req, res) => {
  res.end('hello')
}).listen(5000, 'localhost', (err) => {
  log('Server run http://localhost:5000')
})