import { RISImport, RISPerson, Settings } from '../types';

const type = 'GRANT'

export default function(ris: RISImport, settings: Settings): string {
  // var amount = ''
  for (let i = 0; i < ris.funded.length; i++) {
    const _as = ris.funded[i].as
    if (!_as) {
      continue
    }
    if (_as.type && _as.type === type) {
      const amount = _as.amount.amount
      return amount.toString()
    }
  }
  return ''
}
