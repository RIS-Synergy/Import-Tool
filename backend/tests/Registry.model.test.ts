import { describe, it, expect, vi } from 'vitest'

import { Registry } from '@/models/Registry'

const mocked_endpoints = {
  "endpoints": {
    "funding": [
      {
        "majorVersion": 1,
        "minorVersion": 1,
        "name": "FUNDING",
        "url": "https://risapi.dev.fwf.ac.at/funding/v1/fundings/{id}"
      },
      {
        "majorVersion": 1,
        "minorVersion": 1,
        "name": "FUNDINGS",
        "url": "https://risapi.dev.fwf.ac.at/funding/v1/fundings/"
      }
    ],
    "project": [
      {
        "majorVersion": 1,
        "minorVersion": 1,
        "name": "PROJECT",
        "url": "https://risapi.dev.fwf.ac.at/project/v1/projects/{id}"
      },
      {
        "majorVersion": 1,
        "minorVersion": 1,
        "name": "PROJECTS",
        "url": "https://risapi.dev.fwf.ac.at/project/v1/projects/"
      }
    ]
  }
}

// mock members
vi.mock('../src/utils/oauth2', () => ({
  getAuthEndpoint: vi.fn(async (url: string) => {
    return mocked_endpoints
  }),
}));

const members = [
  {
    "id": "FA1",
    "acronym": "FWF",
    "name": "FWF Österreichischer Wissenschatfsfonds",
    "contact": "itsupport@fwf.ac.at",
    "oauth2": "https://sso.fwf.ac.at/auth/realms/sso/protocol/openid-connect/token",
    "info": "https://risapi.prod.fwf.ac.at/info/v1/info/"
  },
  {
    "id": "FA1_Test",
    "acronym": "FWF Test",
    "name": "FWF Österreichischer Wissenschatfsfonds Test",
    "contact": "itsupport@fwf.ac.at",
    "oauth2": "https://tsso.fwf.ac.at/auth/realms/sso/protocol/openid-connect/token",
    "info": "https://risapi.test.fwf.ac.at/info/v1/info/"
  }
]


describe('Registry', async () => {
  const registry = new Registry(members)
  await registry.run()

  it('members', async () => {
    expect(registry.members).toBe(members)
    expect(registry.members?.length).toBe(2)
  })


  it('endpoints', async () => {
    expect(registry.endpoints).toEqual(new Map([
      ['funding', [
        {
          majorVersion: 1,
          minorVersion: 1,
          name: 'FUNDING',
          url: 'https://risapi.dev.fwf.ac.at/funding/v1/fundings/{id}'
        },
        {
          majorVersion: 1,
          minorVersion: 1,
          name: 'FUNDINGS',
          url: 'https://risapi.dev.fwf.ac.at/funding/v1/fundings/'
        }
      ]],
      ['project', [
        {
          majorVersion: 1,
          minorVersion: 1,
          name: 'PROJECT',
          url: 'https://risapi.dev.fwf.ac.at/project/v1/projects/{id}'
        },
        {
          majorVersion: 1,
          minorVersion: 1,
          name: 'PROJECTS',
          url: 'https://risapi.dev.fwf.ac.at/project/v1/projects/'
        }
      ]]
    ]))
  })

  it('getURL', async () => {
    // @ts-ignore
    expect(registry.getURL('foo', 'PROJECTS')).toBeUndefined()
    expect(registry.getURL('project', 'bar')).toBeUndefined()
    expect(registry.getURL('project', 'PROJECTS')).toBe('https://risapi.dev.fwf.ac.at/project/v1/projects/')
  })
})
