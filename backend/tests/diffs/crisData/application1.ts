export default {
  "applicants": [
    {
      "organizations": [
        {
          "systemName": "Organization",
          "uuid": "Org1-uuid-6789-xyz"
        }
      ],
      "person": {
        "systemName": "Person",
        "uuid": "Person1-uuid-1234-abc"
      },
      "role": {
        "uri": "/dk/atira/pure/application/roles/application/pi"
      },
      "typeDiscriminator": "InternalApplicantAssociation"
    }
  ],
  "title": {
    "de_DE": "Concert Life in Vienna 1780–1830 (Web Database)",
    "en_GB": "Konzertleben in Wien 1780–1830 (Web Datenbank)"
  },
  "organizations": [
    {
      "systemName": "Organization",
      "uuid": "Org1-uuid-6789-xyz"
    }
  ],
  "managingOrganization": {
    "systemName": "Organization",
    "uuid": "Org1-uuid-6789-xyz"
  },
  "fundings": [
    {
      "appliedAmount": {
        "currency": "EUR",
        "value": "100"
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
