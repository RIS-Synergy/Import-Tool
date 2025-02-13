import { describe, it, expect } from 'vitest'
import * as fs from 'fs';
import * as yaml from 'yaml';

const projectsFile = `./samples/projects/${process.env.RIS_TEST_DATA}`
const projects = JSON.parse(fs.readFileSync(projectsFile, 'utf8'))
import { replaceTags } from '../src/ris-pure-etl/index'
import { awaitAllPromises } from '../src/utils/promise'
import { Transform } from '../src/models/Transform'

const p = projects.find(p => p.id === 'PUB3333')

const yamlContent = fs.readFileSync('./resources/transformers/project1.yaml', 'utf8')

const settings = {
  person: '0000-0002-0131-2191',
  organization: 'b2a38757-9395-4089-a2ba-ef39502950c3',
}

describe('YAML', () => {
  it('handle the custom functions', async () => {
    const input = {}
    const parsedYaml = yaml.parse(`output:
  another: "!<fn>hello:World:prosper"
`);
    const processedYaml = await replaceTags(parsedYaml, input, settings);
    const { output } = await processedYaml;
    const { another } = await output;
    expect(another).toEqual('Hello World and prosper')
  })

  it('transform ETL project from FWF to PURE', async () => {
    const transform = new Transform()
    const { output: pure } = await transform.run(yamlContent, p, settings)
    expect(pure.typeDiscriminator).toEqual('AwardManagementProject')

    expect(pure).toEqual({
      systemName: "Project",
      typeDiscriminator: 'AwardManagementProject',
      visibility: {
        key: "FREE",
        description: {
          en_GB: "Public - No restriction",
          de_DE: "Öffentlich - Keine Einschränkungen"
        }
      },
      title: {
        en_GB: "Test Project Number Three",
        de_DE: "Test Projekt Nummer Drei"
      },
      period: {
        startDate: "2021-02-02",
        endDate: "2025-08-01"
      },
      participants: [
        {
          "typeDiscriminator": "InternalParticipantAssociation",
          "person": {
            "systemName": "Person",
            "uuid": settings.person
          },
          "role": {
            "uri": "/dk/atira/pure/upmproject/roles/upmproject/pi"
          },
          "organizations": [
            {
              "systemName": "Organization",
              "uuid": "b2a38757-9395-4089-a2ba-ef39502950c3"
            }
          ]
        }
      ],
      type: {
        uri: "/dk/atira/pure/upmproject/upmprojecttypes/upmproject/research_funding"
      },
      managingOrganization: {
        systemName: "Organization",
        uuid: "b2a38757-9395-4089-a2ba-ef39502950c3"
      },
      organizations: [
        {
          systemName: "Organization",
          uuid: "b2a38757-9395-4089-a2ba-ef39502950c3"
        }
      ],
      identifiers: [{
        "typeDiscriminator": "ClassifiedId",
        "id": '10.55776/PUB3333',
        "type": {
          "uri": "/dk/atira/pure/upm/classifiedsource/crossref_grant_id"
        }
      },
      {
        "typeDiscriminator": "ClassifiedId",
        "id": 'PUB3333',
        "type": {
          "uri": "/dk/atira/pure/upm/classifiedsource/internalprojectid"
        }
      },
      {
        id: "ris:FWF:project:PUB3333",
        type: {
          uri: "/dk/atira/pure/upm/classifiedsource/ris_id"
        },
        typeDiscriminator: "ClassifiedId",
      }],
      keywordGroups: [
          {
            classifications: [
              {
                uri: "/dk/atira/pure/core/oefos2012/6/601004",
              },
              {
                uri: "/dk/atira/pure/core/oefos2012/6/601009",
              },
              {
                uri: "/dk/atira/pure/core/oefos2012/6/601012",
              },
            ],
                logicalName: "oefos2012",
                typeDiscriminator: "ClassificationsKeywordGroup",
              },
        {
                "keywords": [
                  {
                    "freeKeywords": [
                      "Manuscript studies",
                      "Palaeography",
                      "Textual criticism",
                      "Middle Ages",
                      "History of the book",
                      "Medieval manuscripts"
        ],
                    "locale": "en_GB",
                  },
                ],
                "logicalName": "keywordContainers",
                "typeDiscriminator": "FreeKeywordsKeywordGroup",
              }
          ]
    })
  })
})
