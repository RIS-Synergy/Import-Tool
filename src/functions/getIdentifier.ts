import { RISImport, RISPerson, Settings } from '../types';

export default function (ris: RISImport, settings: Settings, type: string): string {
  return ris.identifiers.find(i => i.type === type).value
}
