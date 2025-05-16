import { Function } from "./Function";
import { Executer } from "./Executer";

export class Transform {
  public functions: Function[] = null

  constructor() {
  }

  async run(yamlTemplate: string, input: any, settings: any) {
    if (!this.functions) {
      this.functions = await Function.all();
    }
    const executer = new Executer(yamlTemplate, input, settings)

    this.functions.forEach((fn: Function) => {
      executer.addFunction(fn.name, fn.code)
    })

    const result = await executer.execute()
    return result
  }
}
