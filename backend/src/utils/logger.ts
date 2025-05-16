import { Logger as TSLogger, ILogObj } from "tslog";

const stackDepthLevel = 7;

class WrappedLogger {
  private name?: string;
  private tslogger: any;
  private tsJsonLogger: any;

  constructor(options?: { name?: string }) {
    this.name = options?.name;
    this.tslogger = new TSLogger({
      name: this.name,
    });
    this.tslogger.stackDepthLevel = stackDepthLevel;
    this.tsJsonLogger = new TSLogger({
      name: this.name,
      type: 'hidden',
    });
    this.tsJsonLogger.stackDepthLevel = stackDepthLevel;
  }

  private log(level: string, ...args: any[]): void {
    this.tslogger[level](...args);

    const logObj: ILogObj = this.tsJsonLogger[level](...args);
    // console.log(logObj)
  }

  trace(...args: any[]): void { this.log('trace', ...args); }
  debug(...args: any[]): void { this.log('debug', ...args); }
  info(...args: any[]): void { this.log('info', ...args); }
  warn(...args: any[]): void { this.log('warn', ...args); }
  error(...args: any[]): void { this.log('error', ...args); }
  fatal(...args: any[]): void { this.log('fatal', ...args); }
}

export { WrappedLogger as Logger };
