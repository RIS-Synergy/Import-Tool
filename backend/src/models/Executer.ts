import ivm from "isolated-vm";
import { replacePlaceholders } from '../utils/yaml';

import { Logger } from "tslog";
const log = new Logger({ name: "Executer" });

export async function replaceTags(obj, input, settings, functions) {
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
            const [ fn ] = match[1].split(':').map(arg => arg.trim());
            // the arguments of the function
            const args = match[1].split(':').slice(1)

            // execute the function
            const customFunction = functions[fn]
            obj[key] = await customFunction(input, settings, ...args);
          }
        }
      } else {
        obj[key] = await replaceTags(obj[key], input, settings, functions);
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
  private functions = {}

  constructor(
    private yamlTemplate: string = '',
    private input: any = {},
    private settings: any = {},
    // private functions: string[] = [],
    private timeout = 1000
  ) {}

  public addFunction (name: string, body: string) {
    this.functions[name] = body;
  }

  async asyncCall(yamlTemplate, input, settings, functions): Promise<String> {
    var processedYaml = replacePlaceholders (yamlTemplate, {
      input: input,
      settings: settings
    });

    // create new functions from strings
    functions = Object.entries(JSON.parse(functions)).map(([name, body]) => {
      const fn = eval(`(function ${name}(input, settings, ...args) { ${body} })`);
      return [ name, fn ]
    })
    functions = Object.fromEntries(new Map(functions))

    processedYaml = await replaceTags(processedYaml, input, settings, functions);
    processedYaml = await allPromisesNested(await processedYaml);

    const output = JSON.stringify(processedYaml)
    // log.info("Output", JSON.parse(output))
    // log.info("Input", JSON.parse(input))
    // log.info("Settings", JSON.parse(settings))

    return output
  }

  public async execute () {
    try {
      // Create a new isolated VM
      const isolate = new ivm.Isolate({ memoryLimit: 8 }); // Memory limit in MB
      const context = await isolate.createContext();
      const jail = context.global;
      await jail.set("global", jail.derefInto());
      await jail.set("yamlTemplate", this.yamlTemplate);
      await jail.set("input", JSON.stringify(this.input));
      await jail.set("settings", JSON.stringify(this.settings));
      await jail.set("functions", JSON.stringify(this.functions));

      await jail.set('log', function(...args) {
	      console.log(...args);
      });

      await jail.set('asyncCall', new ivm.Reference(this.asyncCall));
      const fn = await context.eval(`
(async function () {
let str = asyncCall.applySyncPromise(undefined, [yamlTemplate, input, settings, functions]);
return str;
}) `, { reference: true, result: { promise: true }})

      const value: any = await fn.apply(
        undefined,
        [],
        { timeout: 0, result: { promise: true, timeout: 0 } }
      )

      return JSON.parse(value)
      // return value
    } catch (error) {
      log.error(error)
      return { error: error instanceof Error ? error.message : "Unknown error" };
    }
  }
}
