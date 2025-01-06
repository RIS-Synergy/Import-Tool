import ivm from "isolated-vm";
import {Isolate, Reference} from "isolated-vm";

import fs from "fs";
import path from "path";
import { replacePlaceholders } from '../utils/yaml';

import { Logger } from "tslog";
const log = new Logger({ name: "Executer" });

/*
  This is the Template Executer
*/

// load current js file
// const executed_isolate = fs.readFileSync('executer_isolate.js', 'utf-8');
// const executed_isolate = fs.readFileSync(path.join(__dirname, 'executer_isolate.js'), 'utf-8');

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

  // ...extraFunctions
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

  constructor(
    private functions: string[] = [],
    private timeout: number = 200
  ) {}

  public addFunction (fn: String) {
    log.info("Adding function to executer", fn)

    this.functions.push(fn)
  }

  get scriptCode () {
    // get all functions and combine them in one
    var src = `
const functions = {
` // start
    src += this.functions.join("\n\n")
    src += '}' // end

    // XXX
    // src += executed_isolate

    src += '\n\nrun()'

    // console.log(src)


    // TODO add the main function here
    // console.log("=== Script code =======")
    // console.log(src)
    // console.log("=== End script code ===")


    return src
  }

  async myAsyncFunction(): Promise<String> {
    const yamlContent = `
output:
typeDiscriminator: "AwardManagementProject"
`
    const input = {}
    const settings = {}

    var processedYaml = replacePlaceholders (yamlContent, {
      input,
      settings
    });

    // console.log('processedYaml1', processedYaml)

    processedYaml = await replaceTags(processedYaml, input, settings);
    // console.log('processedYaml2', processedYaml)

    processedYaml = await allPromisesNested(await processedYaml);

    console.log( processedYaml)

    const output = JSON.stringify(processedYaml)
    console.log("=== Output =======", output)


    return new Promise((resolve) => {
      setTimeout(() => resolve(output), 10);
    });
  }

  public async execute () {
    try {
      // Create a new isolated VM
      const isolate = new ivm.Isolate({ memoryLimit: 8 }); // Memory limit in MB
      const context = await isolate.createContext();
      const jail = context.global;
      await jail.set("global", jail.derefInto());

      // processedYaml, input, settings
      const yamlContent = `
output:
  typeDiscriminator: "AwardManagementProject"
`
      const input = {}
      const settings = {}
      await jail.set('log', function(...args) {
	      console.log(...args);
      });

      await jail.set('myAsyncFunction', new Reference(this.myAsyncFunction));
      /*
      await jail.set('run', new ivm.Reference(async function () {
        var processedYaml = replacePlaceholders (yamlContent, {
          input,
          settings
        });

        // console.log('processedYaml1', processedYaml)

        processedYaml = await replaceTags(processedYaml, input, settings);
        // console.log('processedYaml2', processedYaml)

        processedYaml = await allPromisesNested(await processedYaml);

        // console.log('processedYaml3', processedYaml)

        // Output the processed YAML content as JSON
        return processedYaml.output
      }, {}));

      // context.evalSync('run("hello world")');

      // return await context.eval('run()');

      // context.evalClosureSync('return run()')
      */

      const fn = await context.eval(`
(async function untrusted() {
let str = await myAsyncFunction.applySyncPromise();
return str;
})
`, { reference: true })
      const value = await fn.apply(undefined, [], { result: { promise: true } })
      console.log(value) // 'Hello from async function in isolate!'
      // string to json
      return JSON.parse(value)

      /*

      const fn = await context.eval(`(async function () {
let str = await run.applySyncPromise();

console.log("=== Str =======", str)


// json to string
// return JSON.stringify(str)
return 'foo'
})`, { reference: true})

      // console.log(fn.copySync())
      console.log(fn)


      // const value = await fn.apply(undefined, [], { copyExternal: true, reference: true, result: { promise: true, copyExternal: true, reference: true } });
      const value = await fn.apply(undefined, [], { result: { promise: true, reference: true } })
      console.log("=== Value =======", value)

      // console.log(value) // 'Hello from async function in isolate!'

      // Execute the code
      // const script = await isolate.compileScript(this.scriptCode);

      // const result = await script.run(context, { timeout: this.timeout }); // Timeout in milliseconds
      return value;
      */
    } catch (error) {
      // console.log("=== Error =======")
      // console.dir(error)
      log.error(error)
      return { error: error instanceof Error ? error.message : "Unknown error" };
    }
  }
}
