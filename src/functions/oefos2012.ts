import { RISImport, RISPerson, Settings } from '../types';

import { getValue } from '../views/oefos'

type Classification = {
  uri: string;
  term: {
    en_GB: string;
    de_DE: string;
  };
}

export default function (ris: RISImport, settings: Settings): Classification[] {
  const { subjects } = ris

  const result: Classification[] = subjects.map((subject) => {
    const { value } = subject

    const de = getValue(value, 'DE')
    const en = getValue(value, 'EN')

    return {
      uri: `/dk/atira/pure/core/oefos2012/${value[0]}/${value}`,
      term: {
        en_GB: `${value} ${en.Titel}`,
        de_DE: `${value} ${de.Titel}`
      }
    }
  })

  return result
}
