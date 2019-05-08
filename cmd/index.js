const createReactApp = require('./create_react_app')
const generateComponent = require('./generate_component')

module.exports = {
  ...createReactApp,
  ...generateComponent,
}
