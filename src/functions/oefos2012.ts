import { RISImport, RISPerson, Settings } from '../types';

type Classification = {
  uri: string;
}

export default function (ris: RISImport, settings: Settings): Classification[] {
  return [
    // {
    //   uri: "/dk/atira/pure/core/oefos2012/5/508003"
    // }
  ]
}
