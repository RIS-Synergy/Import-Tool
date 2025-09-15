import { Logger as TSLogger, ILogObj } from "tslog";
import { pino } from 'pino'
import type { LokiOptions } from 'pino-loki'

const pinoTransport = pino.transport<LokiOptions>({
  target: "pino-loki",
  options: {
    batching: true,
    interval: 5,
    host: process.env.LOKI_HOST,
    labels: {
      ris: 'backend',
    }
  },
});

const stackDepthLevel = 7;

class WrappedLogger {
  private name?: string;
  private tslogger: any;
  private tsJsonLogger: any;
  private pinoLogger: any;

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

    if (process.env.LOKI_HOST) {
      this.pinoLogger = pino(
        {
          base: {}, // removes pid, hostname, etc.
          level: 'info',
        },
        pinoTransport
      );
    }
  }

  private log(level: string, ...args: any[]): void {
    this.tslogger[level](...args);


    const logObj: ILogObj = this.tsJsonLogger[level](...args);

    const listOfNumbers = Object.keys(logObj)
      .filter(key => !isNaN(Number(key))) // keys are numbers
      .sort((a, b) => Number(a) - Number(b))
      .map(key => {
        var obj = logObj[key]
        // @ts-ignore
        if (typeof obj === 'object' && obj !== null && obj.nativeError) {
          // @ts-ignore
          return obj = obj.stack.map(((x: any) => {
            /* TODO
               We should later add native error messages elsewhere.
               Otherwise we're missing important information for debugging.
            */
            return {
              msg: x.message,
              path: x.filePathWithLine,
              method: x.method
            }
          }))
        }
        return obj
      })

    const objectsWitoutNumbers = Object.keys(logObj)
      .filter(key => isNaN(Number(key)))
      .filter(key => key !== '_meta') // not _meta

    const props = {
      name: this.name,
      // @ts-ignore
      src: logObj._meta.path.filePathWithLine.replace(/.*\/src\//, ''),
      ...objectsWitoutNumbers,
    }

    if (process.env.LOKI_HOST) {
      if (listOfNumbers.length === 1) {
        // only one message
        this.pinoLogger[level](props, ...args);
      } else {
        // multiple messages
        this.pinoLogger[level]({
          ...props,
          msgs: listOfNumbers,
        });
      }
    }
  }

  trace(...args: any[]): void { this.log('trace', ...args); }
  debug(...args: any[]): void { this.log('debug', ...args); }
  info(...args: any[]): void { this.log('info', ...args); }
  warn(...args: any[]): void { this.log('warn', ...args); }
  error(...args: any[]): void { this.log('error', ...args); }
  fatal(...args: any[]): void { this.log('fatal', ...args); }
}

export { WrappedLogger as Logger };
