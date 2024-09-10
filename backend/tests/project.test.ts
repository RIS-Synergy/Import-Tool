import { describe, it, expect } from 'vitest'
import fs from 'fs'

const projectsFile = `./samples/projects/${process.env.RIS_USE_DEV}`

const projects = JSON.parse(fs.readFileSync(projectsFile, 'utf8'))

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
