import { readFileSync } from 'fs'
import { describe, it, expect, vi } from 'vitest'
import * as excel from '../src/models/Excel'
import { Excel } from '../src/models/Excel'

const projectsFile = `./samples/projects/${process.env.RIS_TEST_DATA}`
const projects = JSON.parse(readFileSync(projectsFile, 'utf8'))

vi.mock('../../src/models/Project', () => ({
  Project: {
    getById: vi.fn(async (id: string) => {
      const p = projects.find((p: any) => {
        return p.id === id
      })

      return {
        risData: p
      }
    })
  }
}))

const onlyEssentialKeys = [
  'name',
  'details.age',
  'details.address.city',
  'details.address.zip',
  'keywords[0].name',
  'keywords[1].more[0].name',
  'keywords[1].name'
]

describe('Excel helper functions', () => {
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

  const expectedFlattened = {
    "name": "Test",
    "details.age": 30,
    "details.address.city": "New York",
    "details.address.zip": "10001",
    "keywords[0].name": "tag1",
    "keywords[1].name": "tag2",
    "keywords[1].more[0].name": "tag3",
  };

  it('flattenObject keys', () => {
    const result = excel.flattenObject(nestedObject)
    expect(Object.keys(result)).toEqual(Object.keys(expectedFlattened))
  })

  it('flattenObject function', () => {
    const result = excel.flattenObject(nestedObject)
    expect(result).toEqual(expectedFlattened);
  })

  it('jsonToExcel function', () => {
    const result = excel.jsonToExcel([nestedObject], onlyEssentialKeys)
    expect(result.Sheets['Complete List']).toEqual({
      "!ref": "A1:C2",
      A1: { t: "s", v: "name" },
      A2: { t: "s", v: "Test" },
      B1: { t: "s", v: "details" },
      B2: { address: { city: "New York", zip: "10001" }, age: 30 },
      C1: { t: "s", v: "keywords" },
      C2: [
        { name: "tag1" },
        { name: "tag2", more: [ { name: "tag3" } ] }
      ]
    });
  })

  it('Essential List', () => {
    const result = excel.jsonToExcel([nestedObject], onlyEssentialKeys)
    expect(result.Sheets['Essential List']).toEqual({
      "!ref": "A1:C2",
      A1: { t: "s", v: "name" },
      A2: { t: "s", v: "Test" },
      B1: { t: "s", v: "details" },
      B2: { address: { city: "New York", zip: "10001" }, age: 30 },
      C1: { t: "s", v: "keywords" },
      C2: [
        { name: "tag1" },
        { name: "tag2", more: [ { name: "tag3" } ] }
      ]
    });
  })
})

describe('Excel class', () => {
  it('Excel.process', () => {
    expect(Excel.process(projects)).toBeDefined()
    expect(Excel.process(projects)).toBeInstanceOf(Array)
    // expect(Excel.process(projects)).toBe({})
  })

  it('Excel.write', () => {
    const workbook = Excel.write(projects)
    // Excel.writeFile(workbook, 'test.xlsx')
    expect(workbook).toBeDefined()
    expect(workbook.SheetNames).toEqual(['Essential List', "Complete List"])

    // how many rows
    const rows = workbook.Sheets['Complete List']['!ref'].split(':')[1].replace(/[A-Z]/g, '')
    expect(Number(rows)).toBe(21)
    expect(Number(rows)).toBe(projects.length + 1)
  })
})
