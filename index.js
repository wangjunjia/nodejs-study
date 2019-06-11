const fetch = require('request')

class CNodeJS {
  
  constructor(options) {
    this.options = options = options || {}

    options.token = options.token || null
    options.url = options.url || 'https://cnodejs.org/api/v1/'

  }

  baseParams(params) {

    let _params = Object.assign({}, params || {})
    if (this.options.token) {
      _params.accessToken = this.options.token
    }
    return _params
  }
   
  request(method, path, params, callback) {

    if (!callback) {
      return new Promise((resolve, reject) => {
        this.request(method, path, params, (err, res) => {
          err ? reject(err) : resolve(res)
        })
      })
    }
    
    const opts = {
      method: method.toUpperCase(),
      url: this.options.url + path,
      json: true,
    }

    if (opts.method === 'GET' || opts.method === 'HEAD') {
      opts.qs = this.baseParams(params)
    } else {
      opts.body = this.baseParams(params)
    }

    fetch(opts, (err, res, body) => {
      if (err) {
        callback(err)
      } else if (res.statusCode === 200 && body.success) {
        callback(null, body)
      } else if (res.statusCode === 200) {
        callback(new Error(body.error_msg))
      } else {
        callback(new Error(body))
      }
    })
  }
}

module.exports = CNodeJS