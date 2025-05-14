import pino, { stdSerializers } from 'pino';
import type { LokiOptions } from 'pino-loki';
import { PrettyOptions } from 'pino-pretty';
import path from 'path'; // Still needed for path.basename

// --- Helper function to get call site string ---
/**
 * Gets the call site information formatted as "filename:lineNumber".
 * @param depth The number of frames to go up the stack from the caller of this function.
 *              0: getCallSite, 1: caller of getCallSite, etc.
 * @returns Formatted string "filename:lineNumber" or undefined if not available.
 */
function getCallSiteString(depth: number = 0): string | undefined {
  const originalPrepareStackTrace = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, stack) => stack; // Temporarily override to get structured stack
  const err = new Error();
  const stack = err.stack as any as NodeJS.CallSite[]; // Cast to NodeJS.CallSite[]
  Error.prepareStackTrace = originalPrepareStackTrace; // Restore original

  // Adjust depth:
  // 0: getCallSiteString itself
  // 1: caller of getCallSiteString (e.g., PinoWrappedLogger.log)
  // 2: caller of that (e.g., PinoWrappedLogger.info)
  // 3: actual user call site (e.g., main.ts calling log.info)
  const callee = stack[depth + 1]; // +1 because stack[0] is Error creation, stack[1] is getCallSiteString

  if (!callee) {
    return undefined;
  }

  const filePath = callee.getFileName();
  const lineNumber = callee.getLineNumber();

  if (filePath && lineNumber !== undefined) {
    // Use path.basename to get only the filename
    const filename = path.basename(filePath);
    return `${filename}:${lineNumber}`; // Format as "filename:lineNumber"
  }

  return undefined; // Return undefined if file or line number is missing
}
// --- End Helper function ---


// Shared config for all pino instances (except labels in transport)
const sharedPinoConfig = {
  level: process.env.LOG_LEVEL || 'info',
  base: {}, // Pino adds pid, hostname by default.
  serializers: { err: stdSerializers.err },
};

// Cache for pino instances, keyed by the dynamic name
const pinoInstanceCache: Map<string, pino.Logger> = new Map();

function createPinoLoggerForName(name: string): pino.Logger {
  const streamEntries: pino.StreamEntry[] = [];
  const lokiHost = process.env.LOKI_HOST;

  if (lokiHost) {
    streamEntries.push(pino.transport({
      target: "pino-loki",
      options: {
        labels: {
          ris: 'backend',
          name: name,
        },
        batching: true,
        interval: 5,
        host: lokiHost,
      } as LokiOptions,
    }));
  }

  const isDevelopment = process.env.NODE_ENV !== 'production';
  const enableCallSiteInfo = process.env.LOG_CALLSITE === 'true' || isDevelopment; // Enable by default in dev

  if (isDevelopment) {
    streamEntries.push(pino.transport({
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        // --- IMPORTANT ---
        // Ignore the 'src' field if we aren't explicitly adding it to the pretty message format.
        // If you want to display it in pretty logs, you'll likely need messageFormat.
        ignore: 'pid,hostname,name' + (enableCallSiteInfo ? '' : ',src'),
        // --- END IMPORTANT ---
      } as PrettyOptions,
    }));
  }

  // streamEntries.push({ stream: process.stdout }); // Removed as it might duplicate pretty output

  if (streamEntries.length > 0) {
    return pino(sharedPinoConfig, pino.multistream(streamEntries));
  }
  return pino(sharedPinoConfig);
}


class PinoWrappedLogger {
  private name?: string;
  private underlyingPinoLogger: pino.Logger;
  private enableCallSite: boolean;

  constructor(options?: { name?: string; enableCallSiteInfo?: boolean }) {
    this.name = options?.name || 'unknown_component';
    const isDevelopment = process.env.NODE_ENV !== 'production';
    this.enableCallSite = options?.enableCallSiteInfo ?? (process.env.LOG_CALLSITE === 'true' || isDevelopment);


    if (pinoInstanceCache.has(this.name)) {
      this.underlyingPinoLogger = pinoInstanceCache.get(this.name)!;
    } else {
      // console.log(`Logger: Creating new pino instance for name: ${this.name}`);
      this.underlyingPinoLogger = createPinoLoggerForName(this.name);
      pinoInstanceCache.set(this.name, this.underlyingPinoLogger);
    }
  }

  private log(level: keyof pino.Logger, ...args: any[]): void {
    let pinoFirstArg: Record<string, any> = {};
    let pinoMessage: string | undefined = undefined;
    const extraArgsForPayload: any[] = [];

    // --- Add Call Site Information ---
    if (this.enableCallSite) {
      // Depth: 0=getCallSiteString, 1=this.log, 2=this.info/warn/etc., 3=user's code
      const srcString = getCallSiteString(2); // Adjusted depth
      if (srcString) {
        // --- IMPORTANT CHANGE ---
        // Use 'src' as the key name and assign the formatted string directly
        pinoFirstArg.src = srcString;
        // --- END IMPORTANT CHANGE ---
      }
    }
    // --- End Call Site Information ---

    if (args.length === 0) {
      // Log with just the default context (e.g., src if enabled)
      (this.underlyingPinoLogger[level] as any)(pinoFirstArg);
      return;
    }

    const firstArgIsObject =
      typeof args[0] === 'object' &&
      args[0] !== null &&
      !Array.isArray(args[0]) &&
      !(args[0] instanceof Error && sharedPinoConfig.serializers.err);

    if (firstArgIsObject) {
      // Merge call site info (if any) with user's first object
      pinoFirstArg = { ...pinoFirstArg, ...args[0] };

      if (args.length > 1 && typeof args[1] === 'string') {
        pinoMessage = args[1];
        for (let i = 2; i < args.length; i++) extraArgsForPayload.push(args[i]);
      } else {
        for (let i = 1; i < args.length; i++) extraArgsForPayload.push(args[i]);
      }
    } else {
      if (typeof args[0] === 'string') {
        pinoMessage = args[0];
        for (let i = 1; i < args.length; i++) extraArgsForPayload.push(args[i]);
      } else {
        for (const arg of args) extraArgsForPayload.push(arg);
      }
    }

    if (extraArgsForPayload.length > 0) {
      pinoFirstArg.payload = extraArgsForPayload;
    }

    (this.underlyingPinoLogger[level] as any)(pinoFirstArg, pinoMessage);
  }

  // trace, debug, info, warn, error, fatal methods
  trace(...args: any[]): void { this.log('trace', ...args); }
  debug(...args: any[]): void { this.log('debug', ...args); }
  info(...args: any[]): void { this.log('info', ...args); }
  warn(...args: any[]): void { this.log('warn', ...args); }
  error(...args: any[]): void { this.log('error', ...args); }
  fatal(...args: any[]): void { this.log('fatal', ...args); }
}

export { PinoWrappedLogger as Logger };
