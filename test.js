const CNodeJS = require('./index')
const client = new CNodeJS()

client.request('get', 'topics', {page: 1})
  .then(res => console.log('' || res.data[0]))
  .catch(err => console.error(err))

client.request('get', 'topics/5cbfd9aca86ae80ce64b3175', null, (err, res) => {
  console.log(err || '' || res.data)
})