import {classifications} from "./classifications";
import * as yaml from 'yaml';

type RIS = {
  id: string;
  startDate: string;
  endDate: string;

  title: LangText[];
  identifiers: RISIdentifer[];
}

type PURE = {
  typeDiscriminator: "AwardManagementProject"
  systemName: "Project"

  visibility: {
    key: "FREE" | "CAMPUS" // or a few others
    description: {
      [key: string]: string
    }
  }

  title: {
    [key: string]: string
  }

  period: {
    startDate: string;
    endDate: string;
  }

  participants: any[]

  type: {
    uri: string;
    term: {
      [key: string]: string
    }
  }

  managingOrganization: {
    systemName: "Organization",
    uuid: string
  }

  organizations: {
    systemName: "Organization",
    uuid: string
  }[]

  identifiers: any[]
}

type LangText = {
  lang: string;
  trans: "O";
  text: string;
}

type RISIdentifer = {
  type: 'CROSSREF_GRANTID' | 'PROJECT_NUMBER' | 'APPLICATION_NUMBER' | 'ORCID' | 'ROR' | 'RINGGOLD' | 'RIS_SYNERGY';
  value: string;
}

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

type Settings = {
  personUUID: string;
}


const functions = {
  getByLang: function (input: any, pass: string, lang: string): string {
    // if (!input.title) return '`input.title` is not found';
    const title = input[pass].find(t => t.lang === lang);
    return title ? title.text : 'Title not found';
  },

  hello: function (input: any, world: string, and: string): string {
    return `Hello ${world} and ${and}`;
  }
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


export function projectETL2 (input: RIS, yamlContent: string, settings: Settings): PURE {
  // Parse the YAML content
  const parsedYaml = yaml.parse(yamlContent);

  // Process tags in the parsed YAML content
  const processedYaml = replaceTags(parsedYaml, input, settings);

  // console.log(processedYaml)

  // Output the processed YAML content as JSON
  return processedYaml.output
}

// Extract, transform, load
export function projectETL (input: RIS, settings: Settings): PURE {
    var output = {} as PURE;

    // constant for Projects
    output.typeDiscriminator = "AwardManagementProject";
    output.systemName = "Project";

    output.visibility = {
      key: "FREE",
      description: {
        en_GB: "Public - No restriction",
        de_DE: "Öffentlich - Keine Einschränkungen"
      }
    }

    output.title = getLang(input.title)

    output.period = {
      startDate: input.startDate,
      endDate: input.endDate
    }

    output.participants = [
      {
        "typeDiscriminator": "InternalParticipantAssociation",
        "person": {
          "systemName": "Person",
          "uuid": settings.personUUID
        },
        "role": {
          "uri": "/dk/atira/pure/upmproject/roles/upmproject/pi",
          "term": {
            "en_GB": "Project Lead",
            "de_DE": "Projektleiter*in"
          }
        },
        "organizations": [
        {
          "systemName": "Organization",
          "uuid": "b2a38757-9395-4089-a2ba-ef39502950c3"
        }
      ]
    }
  ]

  output.type = {
    uri: "/dk/atira/pure/upmproject/upmprojecttypes/upmproject/research_funding",
    term: {
      en_GB: "Research funding",
      de_DE: "Forschungsförderung"
    }
  }

  output.managingOrganization = {
    systemName: "Organization",
    uuid: "b2a38757-9395-4089-a2ba-ef39502950c3"
  }

  output.organizations = [
    {
      systemName: "Organization",
      uuid: "b2a38757-9395-4089-a2ba-ef39502950c3"
    }
  ]

  input.identifiers.push({
    type: 'RIS_SYNERGY',
    value: `ris:FWF:project:${input.id}`
  })
  output.identifiers = getIdentifiers(input.identifiers)

  return output as PURE
}
