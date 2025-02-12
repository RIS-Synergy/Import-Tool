export default {
  "applicants": [
    {
      "organizations": [
        {
          "systemName": "Organization",
          "uuid": "${settings.organization}"
        }
      ],
      "person": {
        "systemName": "Person",
        "uuid": "${settings.person}"
      },
      "role": {
        "uri": "/dk/atira/pure/application/roles/application/pi"
      },
      "typeDiscriminator": "InternalApplicantAssociation"
    }
  ],
  "title": {
    "de_DE": "!<fn>getByLang:title:en",
    "en_GB": "!<fn>getByLang:title:de"
  },
  "organizations": [
    {
      "systemName": "Organization",
      "uuid": "${settings.organization}"
    }
  ],
  "managingOrganization": {
    "systemName": "Organization",
    "uuid": "${settings.organization}"
  },
  "fundings": [
    {
      "appliedAmount": {
        "currency": "EUR",
        "value": "!<fn>grantAmount"
      },
      "classifications": [
        {
          "uri": "/dk/atira/pure/upm/fundingcategory/fwf"
        }
      ],
      "funder": {
        "systemName": "ExternalOrganization",
        "uuid": "63e8f578-86ce-40cf-914a-f24b88d9eb51"
      },
      "visibility": {
        "key": "BACKEND"
      },
      "typeDiscriminator": "ApplicationFinancialFundingAssociation"
    }
  ],
  "type": {
    "uri": "/dk/atira/pure/application/applicationtypes/application/research_funding/proposal"
  },
  "typeDiscriminator": "AwardManagementApplication"
}
