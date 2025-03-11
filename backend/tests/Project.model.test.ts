import { describe, it, expect } from 'vitest'

import { Project } from '../src/models/Project'

describe('Project', () => {
  it('project model', () => {
    // `ifExists` is a function
    expect(Project.ifExists).toBeInstanceOf(Function)
  })

  describe('findRORInfo', () => {
    it('should return the correct ROR and name from nested structure', () => {
      const fundedItems = [
        {
          type: 'Funding',
          items: [
            {
              type: 'ROR',
              value: '1234-5678-9101',
              name: [
                { lang: 'en', text: 'English Name' },
                { lang: 'de', text: 'German Name' }
              ]
            }
          ]
        }
      ];

      const result = Project.findRORInfo(fundedItems);
      expect(result.ror).toBe('1234-5678-9101');
      expect(result.name).toBe('German Name');
    });

    it('should return null for ROR and name if not found', () => {
      const fundedItems = [
        {
          type: 'Funding',
          items: [
            {
              type: 'Other',
              value: '0000-0000-0000',
              name: [
                { lang: 'en', text: 'English Name' }
              ]
            }
          ]
        }
      ];

      const result = Project.findRORInfo(fundedItems);
      expect(result.ror).toBeNull();
      expect(result.name).toBeNull();
    });
  })
})
