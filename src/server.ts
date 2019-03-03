const app = require('./app');

const server = app.listen(3000, () => {
  console.log(`Server is run http://127.0.0.1:3000`);
  console.log(`Press CTRL-C to stop \n`);
});