export type RISPerson = {
  type: 'PRINCIPAL_INVESTIGATOR'
  person: {
    electronicAddress: string
    personName: {
      familyName: string
      firstName: string
    }
    identifier: {
      type: 'ORCID'
      value: string
    }
  }
}

type RISSubjec = {
  value: string
}

export type RISImport = {
  id: string;
  startDate: string;
  endDate: string;

  title: LangText[];
  identifiers: RISIdentifer[];
  team: RISPerson[];
  subjects: RISSubject[];
  keyword: LangText[];
  funded: any;
}

export type PURE = {
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

export type RISIdentifer = {
  type: 'CROSSREF_GRANTID' | 'PROJECT_NUMBER' | 'APPLICATION_NUMBER' | 'ORCID' | 'ROR' | 'RINGGOLD' | 'RIS_SYNERGY';
  value: string;
}

export type Settings = {
  personUUID: string;
  defaultPersonUUID: string;
}

export type LangText = {
  lang: string;
  trans: "O";
  text: string;
}


