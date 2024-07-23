import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as yaml from "yaml";

import projects from "./samples/fwf/projects";
import { projectETL2, replaceTags } from "../src/ris-pure-etl/index";
import { awaitAllPromises } from "../src/utils/promise";

const p = projects.find((p) => p.id === "P34707");

const yamlContent = fs.readFileSync(
  "./resources/transformers/application.yaml",
  "utf8",
);

const settings = {};

describe("Application", () => {
  it("transform ETL application from FA to RI", async () => {
    const pure = await projectETL2(yamlContent, p, settings);

    expect(pure.typeDiscriminator).toEqual("AwardManagementApplication");

    expect(pure).toEqual({
      "applicants": [
        {
          "organizations": [
            {
              "systemName": "Organization",
              "uuid": "8b21d0c4-84f9-41e4-8224-8511cf7d9587",
            },
          ],
          "person": {
            "systemName": "Person",
            "uuid": "058d63cb-54e3-4359-ae1e-d7e1df8deac5",
          },
          "role": {
            "uri": "/dk/atira/pure/application/roles/application/pi",
          },
          "typeDiscriminator": "InternalApplicantAssociation",
        },
      ],
      "title": {
        "de_DE": "Kreativ (Application)",
        "en_GB": "Creative (Application)",
      },
      "organizations": [
        {
          "systemName": "Organization",
          "uuid": "8b21d0c4-84f9-41e4-8224-8511cf7d9587",
        },
      ],
      "managingOrganization": {
        "systemName": "Organization",
        "uuid": "14ac95fe-8982-4b1f-858a-4adb320c4e9c",
      },
      "fundings": [
        {
          "appliedAmount": {
            "currency": "EUR",
            "value": 100,
          },
          "classifications": [
            {
              "uri": "/dk/atira/pure/upm/fundingcategory/fwf",
            },
          ],
          "funder": {
            "systemName": "ExternalOrganization",
            "uuid": "63e8f578-86ce-40cf-914a-f24b88d9eb51",
          },
          "visibility": {
            "key": "CONFIDENTIAL",
          },
          "typeDiscriminator": "ApplicationFinancialFundingAssociation",
        },
      ],
      "type": {
        "uri":
          "/dk/atira/pure/application/applicationtypes/application/research_funding/proposal",
      },
      "typeDiscriminator": "AwardManagementApplication",
    });
  });
});
