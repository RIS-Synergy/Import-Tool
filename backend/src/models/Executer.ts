import ivm from "isolated-vm";
import { replacePlaceholders } from '../utils/yaml';

import { Logger } from "tslog";
const log = new Logger({ name: "Executer" });

const functions = {
  getByLang: async function (input: any, settings: any, pass: string, lang: string): Promise<string> {
    var title = input[pass].find(t => t.lang === lang);

    if (!title || !title.text) {
      return 'Title not found';
    }

    // replace title with \r\n with <br>
    title = title.text.replace(/\r\n/g, '<br/>');

    return title
  },

  hello: function (input: any, settings: any, world: string, and: string): string {
    return `Hello ${world} and ${and}`;
  },
}

function getLang (title) {
  return {
    en_GB: title.find(t => t.lang === 'en').text,
    de_DE: title.find(t => t.lang === 'de').text
  }
}

export async function replaceTags(obj, input, settings) {
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

            const fun = await functions[fn]
            obj[key] = await fun(input, settings, ...args);
          }
        }
      } else {
        obj[key] = await replaceTags(obj[key], input, settings);
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
  functions: string[] = []

  constructor(
    private yamlTemplate: string = '',
    private input: any = {},
    private settings: any = {},
    // private functions: string[] = [],
  ) {}

  public addFunction (fn: string) {
    this.functions.push(fn)
  }

  async myAsyncFunction(yamlTemplate, input, settings): Promise<String> {
    var processedYaml = replacePlaceholders (yamlTemplate, {
      input: input,
      settings: settings
    });

    processedYaml = await replaceTags(processedYaml, input, settings);
    processedYaml = await allPromisesNested(await processedYaml);

    // console.log( processedYaml)

    const output = JSON.stringify(processedYaml)
    log.info("Output", JSON.parse(output))
    log.info("Input", JSON.parse(input))
    log.info("Settings", JSON.parse(settings))

    return new Promise((resolve) => {
      setTimeout(() => resolve(output), 0);
    });
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

      await jail.set('log', function(...args) {
	      console.log(...args);
      });

      await jail.set('myAsyncFunction', new ivm.Reference(this.myAsyncFunction));
      const fn = await context.eval(`
(async function untrusted() {
let str = await myAsyncFunction.applySyncPromise(undefined, [yamlTemplate, input, settings]);
return str;
}) `, { reference: true, result: { copy: true }})
      const value: any = await fn.apply(
        undefined,
        ['yamlTemplate', 'input', 'settings'],
        { result: { promise: true } }
      )
      return JSON.parse(value)
    } catch (error) {
      log.error(error)
      return { error: error instanceof Error ? error.message : "Unknown error" };
    }
  }
}
