import { describe, it, expect } from 'vitest'
import functions from '../../src/functions'
import keywords from '../../src/functions/keywords'

describe('keywords', () => {
  it('can get a ORCID', () => {
    const input = {
        "keyword": [
          {
            "lang": "en",
            "text": "hello",
            "trans": "H"
          },
          {
            "lang": "en",
            "text": "world",
            "trans": "H"
          },
          {
            "lang": "de",
            "text": "hallo",
            "trans": "H"
          },
          {
            "lang": "de",
            "text": "welt",
            "trans": "H"
          }
      ]
    }
    const settings = {
    }
    const output = keywords(input, settings)
    expect(output).toEqual([
      {
        "locale": "en_GB",
        "freeKeywords": [
          "hello",
          "world"
        ]
      },
      {
        "locale": "de_DE",
        "freeKeywords": [
          "hallo",
          "welt"
          ]
      }
    ])
  })
})
