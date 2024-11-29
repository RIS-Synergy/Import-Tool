import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'

const projectsFile = `./samples/projects/${process.env.RIS_TEST_DATA}`

const projects = JSON.parse(readFileSync(projectsFile, 'utf8'))

// find one project
const projectID = 'PUB3333'

const p = projects.find((p: any) => {
  return p.id === projectID
})

describe('sample fwf project', () => {
  it('has an id and title', () => {
    expect(p.id).toBe(projectID)
    expect(p.title[0].text).toBe('Test Projekt Nummer Drei')
    expect(p.title[1].text).toBe('Test Project Number Three')
  })
})

import { uploadProjectApplicationClusters } from '../src/ris-pure-etl/clusters'

describe('access a project', () => {
  it.skip('has applications/awards clusters', async () => {

    // skip this test in staging or production
    if (process.env.NODE_ENV !== 'development') {
      return
    }

    const project = {
      ...p,
      uuid: 'test-uuid'
    }
    const result = await uploadProjectApplicationClusters(project) // there are some arguments for this function

    expect(await result).toEqual({
      ...p,
      uuid: 'test-uuid',
      applicationClusters: [
        {
          systemName: "ApplicationCluster",
          uuid: 1234,
        }
      ],
      awardClusters: [
        {
          systemName: "AwardCluster",
          uuid: 2345,
        }
      ]
    })
  })
})
