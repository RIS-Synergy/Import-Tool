import { RIS: RISImport } from './types'

export class RIS {
  input: RISImport;

  constructor(input: RISImport) {
    this.input = input;
  }

  function getPerson(): string {
    return this.input.person;
  }

  // greet(): string {
  //   return `Hello, ${this.name}!`;
  // }
}
