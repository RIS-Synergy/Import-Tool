import { describe, expect, it, vi } from "vitest";
import * as fs from "fs";

const projectsFile = `./samples/projects/${process.env.RIS_TEST_DATA}`
const projects = JSON.parse(fs.readFileSync(projectsFile, 'utf8'))
import { Transform } from '@/models/Transform'

const p = projects.find((p) => p.id === "P34707");

const yamlContent = fs.readFileSync(
  "./resources/transformers/application.yaml",
  "utf8",
);

const settings = {};

import mockFixtures from './fixtures/Function.fixture'
vi.mock('../src/models/Function', () => ({
  Function: {
    all: vi.fn(() => mockFixtures.all),
  }
}));

describe("Application", () => {
  it("transform ETL application from FA to RI", async () => {
    const transform = new Transform()
    const { output: pure } = await transform.run(yamlContent, p, settings)

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
            "key": "BACKEND",
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
