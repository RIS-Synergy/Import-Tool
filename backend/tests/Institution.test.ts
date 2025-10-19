import { describe, it, expect, vi } from 'vitest'
import { Institution } from '@/models/Institution'

describe('Institution', () => {
  it('by ROR ID', async () => {
    expect(Institution.getByROR("foo")).toBe(undefined)
    expect(Institution.getByROR(null)).toBe(undefined)

    const inst = Institution.getByROR("https://ror.org/03prydq77")
    expect(inst.name).toBe("Universität Wien")
    expect(inst.ror).toBe("https://ror.org/03prydq77")
    expect(inst.domain).toBe("univie.ac.at")
  })
})
