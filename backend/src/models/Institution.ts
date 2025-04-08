import domains from '../../resources/ri-domains.json'

type InstitutionDomain = {
  name: string
  domain: string
  ror: string
}

export class Institution {
  constructor(public name: string,
    public ror: string,
    public domain: string,
  ) {}

  static getByROR(rorId: string) {
    const inst = domains.find((domain: InstitutionDomain) => {
      return domain.ror === rorId
    })
    if (inst) {
      return new Institution(inst.name, inst.ror, inst.domain)
    }
  }

  static list() {
    return domains
    .sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    })
  }
}
