import { Logger } from './index'

const l = new Logger('node-log')

l.log('log msg')
l.info('info msg')
l.warn('warn msg')
l.error('error msg')