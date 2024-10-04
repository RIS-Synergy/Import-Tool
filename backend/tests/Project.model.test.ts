import { describe, it, expect } from 'vitest'

import { Project } from '../src/models/Project'

describe('Project', () => {
  it('project model', () => {
    // const project = new Project()
    // `ifExists` is a function
    expect(Project.ifExists).toBeInstanceOf(Function)
  })
})
