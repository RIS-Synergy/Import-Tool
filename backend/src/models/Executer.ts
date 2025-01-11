import ivm from "isolated-vm";
import { replacePlaceholders } from '../utils/yaml';

import { Logger } from "tslog";
const log = new Logger({ name: "Executer" });

async function isolatedFunction(context, jail, timeout, name, functionBody, input, settings, args) {
  await jail.set('body', functionBody);
  await jail.set("input", JSON.stringify(input));
  await jail.set("settings", JSON.stringify(settings));
  await jail.set("args", JSON.stringify(args))
  await jail.set('log', function(...args) {
    log.info(`\n> (${name})`, ...args);
  });
  let value = null;
  try {
    value = context.evalSync(`
args = JSON.parse(args);
// input = JSON.parse(input);
// settings = JSON.parse(settings);
log(args)
new Function(body)(input, settings, ...args)
`, { timeout })
  } catch (e) {
    throw new Error(`Custom function error: ${e.message}`)
  }
  // valuse parse if possible
  try {
    value = JSON.parse(value)
  } catch (error) {/* do nothing */ }
  return value
}

async function replaceTags(obj, input, settings, functions, jail, context, timeout) {
  if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        // Handle input placeholders
        if (obj[key].startsWith('${input.')) {
          const inputPath = obj[key].match(/\${input\.(.+)}/)?.[1];
          if (inputPath) {
            obj[key] = input[inputPath];
          }
        }
        else if (obj[key].startsWith('${settings.')) {
          const inputPath = obj[key].match(/\${settings\.(.+)}/)?.[1];
          if (inputPath) {
            obj[key] = settings[inputPath];
          }
        }
        // Handle specific function calls
        else if (obj[key].startsWith('!<fn>')) {
          const match = obj[key].match(/!<fn>(.+)/);
          if (match) {
            // the name of the function
            const [fn] = match[1].split(':').map(arg => arg.trim());
            const name = fn
            // the arguments of the function
            const args = match[1].split(':').slice(1)
            const body = functions[name]
            obj[key] = await isolatedFunction(context, jail, timeout, name, body, input, settings, args);
          }
        }
      } else {
        // let result = await replaceTags(obj[key], input, settings, functions, jail, context);
        let result = null
        try {
          result = await replaceTags(obj[key], input, settings, functions, jail, context, timeout);
        } catch (e) {
          throw new Error(`Custom function error: ${e.message}`)
        }
        obj[key] = result;
      }
    }
  }
  return obj;
}

async function allPromisesNested(obj) {
  if (Array.isArray(obj)) {
    return Promise.all(obj.map(allPromisesNested));
  } else if (obj !== null && typeof obj === 'object') {
    const entries = Object.entries(obj);
    const resolvedEntries = await Promise.all(entries.map(async ([key, value]) => {
      return [key, await allPromisesNested(value)];
    }));
    return Object.fromEntries(resolvedEntries);
  } else {
    return obj;
  }
}

export class Executer {
  private functions: Map<string, string> = new Map();
  public timeout: number = 0;

  constructor(
    private yamlTemplate: string = '',
    private input: any = {},
    private settings: any = {},
    private args: any = [],
  ) { }

  public addFunction(name: string, body: string) {
    this.functions[name] = body;
  }

  private asyncCall(jail, context) {
    var processedYaml = replacePlaceholders(this.yamlTemplate, {
      input: this.input,
      settings: this.settings
    });

    // create new functions from strings
    let functions = Object.entries(this.functions).map(([name, body]) => {
      return [name, body]
    })
    functions = Object.fromEntries(functions)

    return replaceTags(processedYaml, this.input, this.settings, functions, jail, context, this.timeout)
      .then(allPromisesNested)
      .then((result) => {
        return result
      })
      .catch((error) => {
        return { error: error instanceof Error ? error.message : "Unknown error" };
      });
  }

  public async execute() {
    try {
      // Create a new isolated VM
      const isolate = new ivm.Isolate({ memoryLimit: 8 }); // Memory limit in MB
      const context = await isolate.createContext();
      const jail = context.global;
      await jail.set("global", jail.derefInto());
      const result = this.asyncCall(jail, context)
      return result;
    } catch (error) {
      log.error(error)
      return { error: error instanceof Error ? error.message : "Unknown error" };
    }
  }
}
