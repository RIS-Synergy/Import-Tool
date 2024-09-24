import {classifications} from "./classifications";
import * as yaml from 'yaml';
import * as Bluebird from 'bluebird';
import extraFunctions from '../functions';
import {RISImport, PURE, LangText, RISIdentifer, Settings} from "../types";
import { awaitAllPromises } from '../utils/promise'
import { Logger } from 'tslog';
const log = new Logger({ name: 'ETL' });

function getLang (title: LangText[]): { [key: string]: string } {
  return {
    en_GB: title.find(t => t.lang === 'en').text,
    de_DE: title.find(t => t.lang === 'de').text
  }
}

const functions = {
  getByLang: async function (input: any, settings: any, pass: string, lang: string): Promise<string> {
    const title = input[pass].find(t => t.lang === lang);
    return title ? title.text : 'Title not found';
  },

  hello: function (input: any, settings: any, world: string, and: string): string {
    return `Hello ${world} and ${and}`;
  },

  ...extraFunctions
}

export async function replaceTags(obj: any, input: any, settings: any) {
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
            // if it's an async function
            // if (fun.isFunction) {
              // obj[key] = await fun(input, ...args);
            // } else {
            obj[key] = await fun(input, settings, ...args);
            // }
          }
        }
      } else {
        obj[key] = await replaceTags(obj[key], input, settings);
      }
    }
  }
  return obj;
}

import { replacePlaceholders } from '../utils/yaml';

export async function allPromisesNested(obj) {
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

export async function projectETL2 (yamlContent: string, input: RISImport, settings: Settings): Promise<PURE> {
  // Parse the YAML content
  var processedYaml = replacePlaceholders (yamlContent, {
    input,
    settings
  });

  // Process tags in the parsed YAML content
  processedYaml = await replaceTags(processedYaml, input, settings);
  processedYaml = await allPromisesNested(await processedYaml);

  // Output the processed YAML content as JSON
  return processedYaml.output
}

// same, except of the Types
export async function projectETL2cluster (yamlContent: string, input: any, settings: any): Promise<PURE> {
  // Parse the YAML content
  var processedYaml = replacePlaceholders (yamlContent, {
    input,
    settings
  });

  // Process tags in the parsed YAML content
  processedYaml = await replaceTags(processedYaml, input, settings);
  processedYaml = await allPromisesNested(await processedYaml);

  // Output the processed YAML content as JSON
  return processedYaml.output
}
