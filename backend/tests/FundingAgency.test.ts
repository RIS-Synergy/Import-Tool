import { describe, it, expect } from 'vitest'

import { FundingAgency } from '../src/models/FundingAgency'

describe('FundingAgency', () => {
  it('copyProjectToDatabase', () => {
    const agency = new FundingAgency()
    expect(agency.id).toBe('FWF')
  })
})
