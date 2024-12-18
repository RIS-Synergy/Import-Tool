import { RISImport, RISPerson, Settings } from '../types';

function getPI (person: RISPerson, defaultPersonUUID: string) {
  var pi: RISPerson
  // console.log(pi)

  const { identifier, electronicAddress } = person.person

  // if he have an orcid, get it
  if (identifier && identifier.type === 'ORCID') {
    // and the leangth is valid
    if (identifier.value.length === 19) {
      return person.person.identifier.value
    }
  }

  // if he have an email, get it
  if (electronicAddress) {
    return electronicAddress
  }

  return defaultPersonUUID
}

export default function (ris: RISImport, settings: Settings): string {
  if (ris.team && ris.team.length !== 1) {
    throw new Error('Expected exactly one person in the team')
  }
  // console.log('settings in persion', settings)

  const pi = getPI(ris.team[0], settings.defaultPersonUUID);
  // return pi
  return settings.defaultPersonUUID
}
