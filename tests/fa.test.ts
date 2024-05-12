import { describe, it, expect } from 'vitest'

import projects from './samples/fwf/projects'
import { projectETL } from '../src/ris-pure-etl/index'

const p = projects.find(p => p.id === 'P34707')

describe('sample fwf project', () => {
  it('has an id and title', () => {
    expect(p.id).toBe('P34707')
    expect(p.title[1].text).toBe('DNA repair pathway decisions in normal and malignant B cells')
  })

  it('apply the ETL project from FWF to PURE', () => {
    const pure = projectETL(p)
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
            "uuid": "1b8458ea-3853-4279-b45b-d055945269f3"
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
      }]
    })
  })

  it('can save new PURE project', () => {
  })
})
