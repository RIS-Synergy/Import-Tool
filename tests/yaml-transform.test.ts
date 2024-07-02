import { describe, it, expect } from 'vitest'
import * as fs from 'fs';
import * as yaml from 'yaml';

import projects from './samples/fwf/projects'
import { projectETL2, replaceTags } from '../src/ris-pure-etl/index'
import { awaitAllPromises } from '../src/utils/promise'

const p = projects.find(p => p.id === 'P34707')

const yamlContent = fs.readFileSync('./tests/test.yaml', 'utf8')

const settings = {
  personUUID: '0000-0002-0131-2191',
  defaultPersonUUID: 'default'
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
    const pure = await projectETL2(yamlContent, p, settings)

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
        en_GB: "DNA repair pathway decisions in normal and malignant B cells",
        de_DE: "DNA Reparatur in normalen und malignen B Zellen"
      },
      period: {
        startDate: "2022-03-15",
        endDate: "2026-03-14"
      },
      participants: [
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
      ],
      type: {
        uri: "/dk/atira/pure/upmproject/upmprojecttypes/upmproject/research_funding",
        term: {
          en_GB: "Research funding",
          de_DE: "Forschungsförderung"
        }
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
        "id": '10.55776/P34707',
        "type": {
          "uri": "/dk/atira/pure/upm/classifiedsource/crossref_grant_id",
          "term": {
            "de_DE": "Crossref grant ID",
            "en_GB": "Crossref grant ID",
          }
        }
      },
      {
        "typeDiscriminator": "ClassifiedId",
        "id": 'P 34707',
        "type": {
          "uri": "/dk/atira/pure/upm/classifiedsource/internalprojectid",
          "term": {
            "de_DE": "Projektnummer",
            "en_GB": "Project ID",
          }
        }
      },
      {
        id: "ris:FWF:project:P34707",
        type: {
          term: {
            de_DE: "RIS Synergy ID",
            en_GB: "RIS Synergy ID",
          },
          uri: "/dk/atira/pure/upm/classifiedsource/ris_id",
        },
        typeDiscriminator: "ClassifiedId",
      }],
      keywordGroups: [
          {
            classifications: [
              {
                term: {
                  de_DE: "301108 Molekulare Pathologie",
                  en_GB: "301108 Molecular pathology",
                },
                uri: "/dk/atira/pure/core/oefos2012/3/301108",
              },
              {
                term: {
                  de_DE: "301306 Medizinische Molekularbiologie",
                  en_GB: "301306 Medical molecular biology",
                },
                uri: "/dk/atira/pure/core/oefos2012/3/301306",
              },
            ],
                logicalName: "oefos2012",
                name: {
                    de_DE: "ÖFOS 2012",
                      en_GB: "Austrian Fields of Science 2012",
                    },
                typeDiscriminator: "ClassificationsKeywordGroup",
              },
          ]
    })
  })
})
