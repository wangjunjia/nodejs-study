const redis = require('ioredis')
const uid = require('uid-safe')

class Store {
  constructor() {
    this.redis = new redis() // default: 127.0.0.1 6379
  }

  getId(length) {
    return uid.sync(length)
  }

  get(sid) {
    return this.redis.get(`session-${sid}`).then((res) => {
      try {
        return Promise.resolve(JSON.parse(res))
      } catch (err) {
        return Promise.resolve({})
      }
    })
  }

  set(session, opts) {
    if (!opts.sid) {
      opts.sid = this.getId(24)
    }

    return this.redis.set(`sessioin-${opts.sid}`, JSON.stringify(session)).then(() => {
      return Promise.resolve(opts.sid)
    })
  }

  destroy(sid) {
    return this.redis.del(`session-${sid}`)
  }
}

module.exports = Store