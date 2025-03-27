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

    const result = excel.flattenObject(nestedObject)
    expect(result).toEqual(expectedFlattened);
  })

  it('jsonToExcel function', () => {
    const result = excel.jsonToExcel([nestedObject])
    expect(result.Sheets).toEqual({
      'Complete List': {
        '!ref': 'A1:G2',
        A1: { t: 's', v: 'keywords[0].name' },
        B1: { t: 's', v: 'keywords[1].more[0].name' },
        C1: { t: 's', v: 'keywords[1].name' },
        D1: { t: 's', v: 'details.address.city' },
        E1: { t: 's', v: 'details.address.zip' },
        F1: { t: 's', v: 'details.age' },
        G1: { t: 's', v: 'name' },

        A2: { t: 's', v: 'tag1' },
        B2: { t: 's', v: 'tag3' },
        C2: { t: 's', v: 'tag2' },
        D2: { t: 's', v: 'New York' },
        E2: { t: 's', v: '10001' },
        F2: { t: 'n', v: 30 },
        G2: { t: 's', v: 'Test' },
      }
    });
  })
})


describe('Excel class', () => {

  it('Excel.write', () => {
    const workbook = Excel.write(projects)
    // Excel.writeFile(workbook, 'test.xlsx')
    expect (workbook).toBeDefined()
    expect(workbook.SheetNames).toEqual(['Complete List'])

    // how many rows
    const rows = workbook.Sheets['Complete List']['!ref'].split(':')[1].replace(/[A-Z]/g, '')
    expect(Number(rows)).toBe(projects.length + 1)
  })
})
