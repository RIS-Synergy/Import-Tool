import { describe, it, expect } from 'vitest'

import { Project } from '../src/models/Project'

describe('Project', () => {
  it('project model', () => {
    // `ifExists` is a function
    expect(Project.ifExists).toBeInstanceOf(Function)
  })

  describe('findRORInfo', () => {
    const fundedItems =
      [
        {
          "by": {
            "id": "FWF",
            "name": {
              "lang": "de",
              "trans": "O",
              "text": "Österreichischer Wissenschaftsfonds FWF"
            }
          }
        },
        {
          "as": {
            "id": "10.55776/CSP6797524",
            "type": "GRANT",
            "name": {
              "lang": "de",
              "trans": "H",
              "text": "Top Citizen Science"
            },
            "amount": {
              "currency": "EUR",
              "amount": 96001.5
            },
            "recipients": [
              {
                "orgUnit": {
                  "id": "13",
                  "name": [
                    {
                      "lang": "de",
                      "trans": "O",
                      "text": "Akademie der bildenden Künste Wien"
                    }
                  ],
                  "identifiers": [
                    {
                      "type": "ROR",
                      "value": "https://ror.org/029djt864"
                    }
                  ]
                }
              }
            ]
          }
        }
      ];
    expect(fundedItems[1].as.recipients.length).toBe(1)

    it('should return the correct ROR and name from nested structure', () => {
      const result = Project.findRORInfo(fundedItems);
      expect(result.ror).toBe("https://ror.org/029djt864")
      expect(result.name).toBe("Akademie der bildenden Künste Wien")
    });

    it('should return null for ROR and name if not found', () => {
      const recipients = []
      fundedItems[1].as.recipients = recipients
      const result = Project.findRORInfo(fundedItems);
      expect(result.ror).toBeNull();
      expect(result.name).toBeNull();
    });

    it('similar function `hasROR`', () => {
      // using 2 orgUnits
      expect(fundedItems[1].as.recipients.length).toBe(0)
      expect(Project.hasROR(fundedItems, "https://ror.org/029djt864")).toBe(false)
      expect(Project.hasROR(fundedItems, "https://ror.org/03yrm5c26")).toBe(false)
      expect(Project.hasROR(fundedItems, "https://ror.org/12345")).toBe(false)
      fundedItems[1].as.recipients.push(
        {
          orgUnit: {
            id: "14",
            name: [
              {
                lang: "de",
                trans: "O",
                text: "Universität Wien"
              }
            ],
            identifiers: [
              {
                type: "ROR",
                value: "https://ror.org/03yrm5c26"
              }
            ]
          }
        })
      expect(fundedItems[1].as.recipients.length).toBe(1)
      expect(Project.hasROR(fundedItems, "https://ror.org/029djt864")).toBe(false)
      expect(Project.hasROR(fundedItems, "https://ror.org/03yrm5c26")).toBe(true)
      expect(Project.hasROR(fundedItems, "https://ror.org/12345")).toBe(false)
      fundedItems[1].as.recipients.push(
        {
          orgUnit: {
            id: "13",
            name: [
              {
                lang: "de",
                trans: "O",
                text: "Akademie der bildenden Künste Wien"
              }
            ],
            identifiers: [
              {
                type: "ROR",
                value: "https://ror.org/029djt864"
              }
            ]
          }
        }
      )
      // fundedItems[1].as.recipients = recipients;
      expect(fundedItems[1].as.recipients.length).toBe(2)
      expect(Project.hasROR(fundedItems, "https://ror.org/029djt864")).toBe(true)
      expect(Project.hasROR(fundedItems, "https://ror.org/03yrm5c26")).toBe(true)
      expect(Project.hasROR(fundedItems, "https://ror.org/12345")).toBe(false)
    })
  })
})
