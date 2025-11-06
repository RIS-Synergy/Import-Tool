import ivm from 'isolated-vm';

import { TransformService } from '@/features/transform/services/transform.service.js';

import { Logger } from '@/utils/logger.js';
const log = new Logger({ name: 'FunctionVerifyService' });

export class FunctionVerifyService {

  public async verify(name: string, code: string, input: object, settings: object): Promise<{ output: any, error: any }> {
    const yamlTemplate = `output: 42`
    const transformservice = new TransformService()
    try {
    const {transformationResult} = await transformservice.transformByYaml(
      yamlTemplate,
      input,
      settings
    )
    return {
      output: transformationResult,
      error: null
    };
    } catch (error) {
      log.error('Function verification error:', error);
      return {
        output: null,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  public async verify2(name: string, code: string, input: object, settings: object): Promise<{ output: any, error: any }> {
    try {
      // Create a new isolated VM
      const isolate = new ivm.Isolate({ memoryLimit: 8 });
      const context = await isolate.createContext();
      const jail = context.global;
      await jail.set("global", jail.derefInto());

      // Prepare the function to be called
      const preParse = `
try { input = JSON.parse(input) } catch (e) {};
try { settings = JSON.parse(settings) } catch (e) {};
`;
      await jail.set('body', preParse + code);
      await jail.set("input", JSON.stringify(input));
      await jail.set("settings", JSON.stringify(settings));
      await jail.set("args", JSON.stringify([]));

      // Execute the function directly
      let value = null;
      try {
        value = context.evalSync(`
args = JSON.parse(args);
JSON.stringify(new Function(args, body)(...args));
`, { timeout: 5000 });
      } catch (e) {
        return {
          output: null,
          error: `Custom function "${name}" error: ${e.message}`
        };
      }

      // Parse the result if possible
      try {
        value = JSON.parse(value);
      } catch (error) {
        // Do nothing
      }

      return {
        output: value,
        error: null
      };
    } catch (error) {
      log.error('Function verification error:', error);
      return {
        output: null,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
}
