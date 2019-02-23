var express = require('express')
var request = require('request')
var app = express()

app.use('/', function (req, res) {
  var url = 'https://www.baidu.com/' + req.url
  req.pipe(request(url)).pipe(res)
})

let PORT = process.env.PORT || 3000
app.listen(PORT, function (err) {
  if (err) {
    throw err
  }
  console.log(`server running on http://localhost:${PORT}`);
})
