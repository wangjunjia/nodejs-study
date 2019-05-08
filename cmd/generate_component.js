const chalk = require('chalk')
const fsExtra = require('fs-extra')
const path = require('path')
const log = console.log

function createComponent(componentName, hasFolder, isStateless = false, isPureCompoent = false) {
  let dirPath = path.join(process.cwd())
  if (hasFolder) {
    dirPath = path.join(dirPath, componentName)
    const result = fsExtra.ensureDirSync(dirPath)
    if (!result) {
      log(chalk.red(`${dirPath} already exists`))
      process.exit(1)
    }
    const indexJS = getIndexJS(componentName)
    const css = `@charset "utf-8";\n`
    fsExtra.writeFileSync(path.join(dirPath, 'index.js'), indexJS)
    fsExtra.writeFileSync(path.join(dirPath,  `${componentName}.css`), css)
  }
  let component = isStateless 
    ? getStatelessComponent(componentName, hasFolder) 
    : getClassComponent(componentName, isPureCompoent ? 'React.PureCompoent' : 'React.Component', hasFolder)
  
    fsExtra.writeFileSync(path.join(dirPath, `${componentName}.js`), component)
    log(chalk.green(`The ${componentName} component was successfully generated!`))
    process.exit(0)
}

function getClassComponent(componentName, extendFrom, hasFolder) {
  let headerStr = `
import React from 'react'
import PropTypes from 'prop-types'
`

  let cssStr = `import './${componentName}.css'` 

  let bodyStr = `
export default class ${componentName} extends ${extendFrom} {
  static propTypes = {}

  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (<div>${componentName}</div>)
  }
}    
`
  let template = headerStr + (hasFolder ? cssStr : '') + bodyStr 
  return template
}

function getStatelessComponent(componentName, hasFolder) {
  let headerStr = `
import React from 'react'
import PropTypes from 'prop-types'
`

  let cssStr = `import './${componentName}.css'` 

  let bodyStr = `

const ${componentName} = props => {
  return (<div>${componentName}</div>)
}   

${componentName}.propTypes = {}
${componentName}.defaultProps = {}

export default ${componentName}

`
  let template = headerStr + (hasFolder && cssStr) + bodyStr 
  return template
}

function getIndexJS(componentName) {
  return `import ${componentName} from './${componentName}'

export default ${componentName}`
}


module.exports = {
  createComponent,
  getIndexJS,
  getStatelessComponent,
  getClassComponent
}