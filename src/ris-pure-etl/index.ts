import {classifications} from "./classifications";

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

// Extract, transform, load
export function projectETL (input: RIS): PURE {
  var output = {} as PURE;

  // console.log(input)

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
