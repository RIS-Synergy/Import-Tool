import {classifications} from "./classifications";
import * as yaml from 'yaml';
import extraFunctions from '../functions';
import {RIS, PURE, LangText, RISIdentifer, Settings} from "../types";

function getLang (title: LangText[]): { [key: string]: string } {
  return {
    en_GB: title.find(t => t.lang === 'en').text,
    de_DE: title.find(t => t.lang === 'de').text
  }
}

function getIdentifiers (identifiers: RISIdentifer[]) {
  return identifiers.map(i => {
    const { term, uri } = classifications.find(c => c.id === i.type)
    return {
      typeDiscriminator: "ClassifiedId",
      id: i.value,
      type: {
        uri,
        term
      }
    }
  })
}

const functions = {
getByLang: function (input: any, pass: string, lang: string): string {
    // if (!input.title) return '`input.title` is not found';
    const title = input[pass].find(t => t.lang === lang);
    return title ? title.text : 'Title not found';
  },

  hello: function (input: any, world: string, and: string): string {
    return `Hello ${world} and ${and}`;
  },

  ...extraFunctions
}

export function replaceTags(obj: any, input: any, settings: any): any {
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
            obj[key] = functions[fn](input, ...args);
          }
        }
      } else {
        obj[key] = replaceTags(obj[key], input, settings);
      }
    }
  }
  return obj;
}

import { replacePlaceholders } from '../utils/yaml';

export function projectETL2 (yamlContent: string, input: RIS, settings: Settings): PURE {
  // Parse the YAML content
  var processedYaml = replacePlaceholders (yamlContent, {
    input,
    settings
  });

  // Process tags in the parsed YAML content
  processedYaml = replaceTags(processedYaml, input, settings);

  // Output the processed YAML content as JSON
  return processedYaml.output
}
