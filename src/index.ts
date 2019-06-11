import { format as formatString } from 'util'

import chalk from 'chalk'

export function leftPad(n:number): string {
  return n < 10 ? '0' + n : '' + n
}

function getDateString() {
  let timeStr = (new Date()).toLocaleString('zh-Hans-CN', 
  { timeZone: 'Asia/Shanghai', 
    timeZoneName: 'long', 
    era: 'long', 
    hour12: false, 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    weekday: 'long', 
    hour: '2-digit', 
    minute: 'numeric', 
    second: '2-digit', 
  })
  return timeStr
}

export class Logger {

  protected readonly prefix: string
  public color: boolean = true

  constructor(prefix: string = '') {
    this.prefix = prefix ? prefix + ' ' : ''
  }

  protected print(isError: boolean, msg: string): void {
    if (this.color) {
      this.printWithColor(isError, msg)
    } else {
      this.printNoColor(isError, msg)
    }
  }

  private printWithColor(isError: boolean, msg: string): void {
    const content = chalk.greenBright(getDateString()) 
      + ' '
      + chalk.cyan(this.prefix)
      + msg 
      + '\n'
    this._print(isError, content)
  }

  private printNoColor(isError: boolean, msg: string): void {
    const content = chalk.greenBright(getDateString()) 
      + ' ' 
      + this.prefix 
      + ' ' 
      + msg 
      + '\n'
    this._print(isError, content)
  }

  private _print(isError: boolean, msg: string): void {
    if (isError) {
      process.stderr.write(msg)
    } else {
      process.stdout.write(msg)
    }
  }

  public error(format: any, ...params: any[]) {
    this.print(true, chalk.red(formatString(format, ...params)))
  }

  public warn(format: any, ...params: any[]) {
    this.print(true, chalk.yellow(formatString(format, ...params)))
  }

  public info(format: any, ...params: any[]) {
    this.print(true, formatString(format, ...params))
  }
  
  public log(format: any, ...params: any[]) {
    this.print(true, formatString(format, ...params))
  }


}
