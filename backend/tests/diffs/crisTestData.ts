export const templateData = {
  typeDiscriminator: 'AwardManagementProject',
  systemName: 'Project',
  visibility: {
    key: 'FREE',
    description: {
      en_GB: 'Public - No restriction',
      de_DE: 'Öffentlich - Keine Einschränkungen'
    }
  },
  title: {
    en_GB: 'Concert Life in Vienna 1780–1830 (Web Database)',
    de_DE: 'Konzertleben in Wien 1780–1830 (Web Datenbank)'
  },
  period: {
    startDate: '2023-12-07',
    endDate: '2026-12-06'
  },
  participants: [
    {
      typeDiscriminator: 'InternalParticipantAssociation',
      person: {
        systemName: 'Person',
        uuid: 'Person1-uuid-1234-abc'
      },
      role: {
        uri: '/dk/atira/pure/upmproject/roles/upmproject/pi'
      },
      organizations: [
        {
          systemName: 'Organization',
          uuid: 'Org1-uuid-6789-xyz'
        }
      ]
    }
  ],
  type: {
    uri: '/dk/atira/pure/upmproject/upmprojecttypes/upmproject/research_funding'
  },
  managingOrganization: {
    systemName: 'Organization',
    uuid: 'Org1-uuid-6789-xyz'
  },
  organizations: [
    {
      systemName: 'Organization',
      uuid: 'Org1-uuid-6789-xyz'
    }
  ],
  identifiers: [
    {
      typeDiscriminator: 'ClassifiedId',
      id: '10.55776/PUD33',
      type: {
        uri: '/dk/atira/pure/upm/classifiedsource/crossref_grant_id'
      }
    },
    {
      typeDiscriminator: 'ClassifiedId',
      id: 'PUD 33',
      type: {
        uri: '/dk/atira/pure/upm/classifiedsource/internalprojectid'
      }
    },
    {
      id: 'ris:FWF:project:PUD33',
      type: {
        uri: '/dk/atira/pure/upm/classifiedsource/ris_id'
      },
      typeDiscriminator: 'ClassifiedId'
    }
  ],
  keywordGroups: [
    {
      typeDiscriminator: 'ClassificationsKeywordGroup',
      logicalName: 'oefos2012',
      classifications: [
        {
          uri: '/dk/atira/pure/core/oefos2012/1/103002'
        },
        {
          uri: '/dk/atira/pure/core/oefos2012/2/201201'
        },
        {
          uri: '/dk/atira/pure/core/oefos2012/6/604022'
        },
        {
          uri: '/dk/atira/pure/core/oefos2012/6/604024'
        }
      ]
    },
    {
      typeDiscriminator: 'FreeKeywordsKeywordGroup',
      logicalName: 'keywordContainers',
      keywords: [
        {
          locale: 'en_GB',
          freeKeywords: [
            'Concert life',
            'Music history of Vienna',
            'Room acoustics',
            'Musical performances',
            'Cultural topography',
            'Digital reconstruction'
          ]
        }
      ]
    }
  ]
}
