// Using the PURE API:
// curl -X GET "/ws/api/projects/allowed-classified-identifier-types"

// The Identifiers for RIS are listed here: https://documentation.forschungsdaten.at/identifier/
// CROSSREF_GRANTID
// PROJECT_NUMBER
// APPLICATION_NUMBER
// ORCID
// ROR
// RINGGOLD
// RIS_SYNERGY

export const classifications = [
    {
      id: 'PROJECT_NUMBER',
      "uri": "/dk/atira/pure/upm/classifiedsource/internalprojectid",
      "term": {
        "en_GB": "Project ID",
        "de_DE": "Projektnummer"
      }
    },
    {
      id: 'RIS_SYNERGY',
      "uri": "/dk/atira/pure/upm/classifiedsource/ris_id",
      "term": {
        "en_GB": "RIS Synergy ID",
        "de_DE": "RIS Synergy ID"
      }
    },
    {
      id: 'CROSSREF_GRANTID',
      "uri": "/dk/atira/pure/upm/classifiedsource/crossref_grant_id",
      "term": {
        "en_GB": "Crossref grant ID",
        "de_DE": "Crossref grant ID"
      }
    },
  ]
