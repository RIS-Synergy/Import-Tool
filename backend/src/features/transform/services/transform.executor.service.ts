import ivm from "isolated-vm";
import { replacePlaceholders } from '@/utils/yaml.js';
import { getValue as oefosValue } from '@/views/oefos.js';
import { TransformFunctionService } from './transform.function.service.js';
import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: "Executer" });

export class TransformExecutorService {
  constructor(private functionService: TransformFunctionService) {}

  private async isolatedFunction(context, jail, timeout, name, functionBody, input, settings, args) {
    const preParse = `
try { input = JSON.parse(input) } catch (e) {};
try { settings = JSON.parse(settings) } catch (e) {};
`
    await jail.set('body', preParse + functionBody);
    await jail.set("input", JSON.stringify(input));
    await jail.set("settings", JSON.stringify(settings));
    await jail.set("args", JSON.stringify(args))
    await jail.set('log', function(...args) {
      log.info(`\n> (${name})`, ...args);
    });
    // at the moment, we don't use these functions (in 'keywords' for PURE)
    await jail.set("oefosValue", oefosValue)

    let value = null;
    try {
      value = context.evalSync(`
args = JSON.parse(args);
JSON.stringify(new Function(args, body)(...args));
`, { timeout })
    } catch (e) {
      throw new Error(`Custom function "${name}" error: ${e.message}`)
    }
    // value parse if possible
    try {
      value = JSON.parse(value)
    } catch (error) {/* do nothing */ return value }
    return value
  }

  private async replaceTags(obj, input, settings, functions, jail, context, timeout) {
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          // Handle input placeholders
          if (obj[key].startsWith('${input.')) {
            console.log(obj[key])
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
              obj[key] = await this.isolatedFunction(context, jail, timeout, name, body, input, settings, args);
            }
          }
        } else {
          let result = null
          try {
            result = await this.replaceTags(obj[key], input, settings, functions, jail, context, timeout);
          } catch (e) {
            throw new Error(`${e.message}`)
          }
          obj[key] = result;
        }
      }
    }
    return obj;
  }

  private async allPromisesNested(obj) {
    if (Array.isArray(obj)) {
      return Promise.all(obj.map(item => this.allPromisesNested(item)));
    } else if (obj !== null && typeof obj === 'object') {
      const entries = Object.entries(obj);
      const resolvedEntries = await Promise.all(entries.map(async ([key, value]) => {
        return [key, await this.allPromisesNested(value)];
      }));
      return Object.fromEntries(resolvedEntries);
    } else {
      return obj;
    }
  }

  async execute(yamlTemplate: string, input: any, settings: any) {
    const functions = await this.functionService.loadFunctions();

    // Create a new isolated VM
    const isolate = new ivm.Isolate({ memoryLimit: 8 });
    const context = await isolate.createContext();
    const jail = context.global;
    await jail.set("global", jail.derefInto());

    // Prepare functions map
    const functionsMap = Object.fromEntries(
      functions.map(fn => [fn.name, fn.code])
    );

    // Process the template
    const processedYaml = replacePlaceholders(yamlTemplate, {
      input,
      settings
    });

    try {
      const result = await this.replaceTags(processedYaml, input, settings, functionsMap, jail, context, 0);
      const finalResult = await this.allPromisesNested(result);
      return { output: finalResult, error: null };
    } catch (error) {
      log.error(error);
      return {
        output: null,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
}
