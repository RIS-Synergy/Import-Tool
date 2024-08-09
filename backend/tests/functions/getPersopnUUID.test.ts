import { describe, it, expect } from 'vitest'
import functions from '../../src/functions'
import getPersonUUID from '../../src/functions/getPersonUUID'

describe.skip('getPersopnUUID', () => {
  it('can get a ORCID', () => {
    const input = {
      "team": [
        {
          "type": "PRINCIPAL_INVESTIGATOR",
          "person": {
            "electronicAddress": "markus.teige@univie.ac.at",
            "personName": {
              "familyName": "Teige",
              "firstName": "Markus"
            },
            "identifier": {
              "type": "ORCID",
              "value": "0000-0001-7204-1379"
            }
          }
        }
      ]
    }
    const settings = {
      personUUID: '1b8458ea-3853-4279-b45b-d055945269f3',
      defaultPersonUUID: 'dummy-default-person'
    }
    const output = getPersonUUID(input, settings)
    expect(output).toEqual('0000-0001-7204-1379')
  })

  it('can\'t get a ORCID - use email', () => {
    const input = {
      "team": [
        {
          "type": "PRINCIPAL_INVESTIGATOR",
          "person": {
            "electronicAddress": "markus.teige@univie.ac.at",
            "personName": {
              "familyName": "Teige",
              "firstName": "Markus"
            },
            "identifier": {
              "type": "ORCID",
              "value": "0000-0001"
            }
          }
        }
      ]
    }
    const settings = {
      personUUID: '1b8458ea-3853-4279-b45b-d055945269f3',
      defaultPersonUUID: 'dummy-default-person'
    }
    const output = getPersonUUID(input, settings)
    expect(output).toEqual('markus.teige@univie.ac.at')
  })

  it('can\'t have an identifier - use the default UUID', () => {
    const input = {
      "team": [
        {
          "type": "PRINCIPAL_INVESTIGATOR",
          "person": {
            "personName": {
              "familyName": "Teige",
              "firstName": "Markus"
            },
          }
        }
      ]
    }
    const settings = {
      personUUID: '1b8458ea-3853-4279-b45b-d055945269f3',
      defaultPersonUUID: 'dummy-default-person'
    }
    const output = getPersonUUID(input, settings)
    expect(output).toEqual('dummy-default-person')
  })

})
