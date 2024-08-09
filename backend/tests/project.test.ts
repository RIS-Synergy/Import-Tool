import { describe, it, expect } from 'vitest'

import projects from './samples/fwf/projects'

const p = projects.find(p => p.id === 'P34707')

describe('sample fwf project', () => {
  it('has an id and title', () => {
    expect(p.id).toBe('P34707')
    expect(p.title[1].text).toBe('DNA repair pathway decisions in normal and malignant B cells')
  })
})
