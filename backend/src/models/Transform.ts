import { Function } from "./Function";
import { Executer } from "./Executer";
import { Logger } from "tslog";
const log = new Logger({ name: "Transform" });

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

    return (await executer.execute()).output
  }
}
