import { describe, it, expect } from 'vitest'
import { flattenObject, jsonToExcel } from '../src/models/Excel'

describe('Excel class', () => {
  const nestedObject = {
    name: "Test",
    details: {
      age: 30,
      address: {
        city: "New York",
        zip: "10001"
      }
    },
    keywords: [
      { name: "tag1" },
      {
        name: "tag2", more: [
          { name: "tag3" }
        ]
      }
    ]
  };

  it('flattenObject function', () => {

    const expectedFlattened = {
      "name": "Test",
      "details.age": 30,
      "details.address.city": "New York",
      "details.address.zip": "10001",
      "keywords[0].name": "tag1",
      "keywords[1].more[0].name": "tag3",
      "keywords[1].name": "tag2",
    };

    const result = flattenObject(nestedObject);
    expect(result).toEqual(expectedFlattened);
  })
  it('jsonToExcel function', () => {
    const result = jsonToExcel([ nestedObject ])

    expect(result.Sheets.Sheet1).toEqual({
      "!ref": "A1:G2",
      "A1": { "t": "s", "v": "name" },
      "A2": { "t": "s", "v": "Test" },
      "B1": { "t": "s", "v": "details.age" },
      "B2": { "t": "n", "v": 30 },
      "C1": { "t": "s", "v": "details.address.city" },
      "C2": { "t": "s", "v": "New York" },
      "D1": { "t": "s", "v": "details.address.zip" },
      "D2": { "t": "s", "v": "10001" },
      "E1": { "t": "s", "v": "keywords[0].name" },
      "E2": { "t": "s", "v": "tag1" },
      "F1": { "t": "s", "v": "keywords[1].name" },
      "F2": { "t": "s", "v": "tag2" },
      "G1": { "t": "s", "v": "keywords[1].more[0].name" },
      "G2": { "t": "s", "v": "tag3" }
    });
  })
})
