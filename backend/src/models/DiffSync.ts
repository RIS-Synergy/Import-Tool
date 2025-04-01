import { Logger } from "tslog"
import { ResearchInstitution } from "./ResearchInstitution"
import { Diff } from "./Diff";
import { Template } from "./Template";
const log = new Logger({ name: "DiffSync" });

import { parseTimeoutString } from "../utils/sync";

const ri = new ResearchInstitution()

export class DiffSync {
  async process() {
    try {
      log.debug('Processing DiffSync');
      const result = await ri.getAllProjects("Project");
      log.info('CRIS found', result.items.length, "Projects");
      await this.processItems(result.items);
    } catch (error) {
      log.error('Error processing DiffSync', error);
    }
  }

  private async processItems(items: any[]) {
    for (const item of items) {
      try {
        await this.processItem(item);
      } catch (error) {
        log.error(`Error processing item`, error, item);
      }
    }
  }

  private async processItem(item: any) {
    const risId = ri.entityToRISId(item);
    const diff = new Diff(risId);
    await diff.setProjectData();
    diff.crisData = item;
    const templateSelected = await Template.first("PROJECT");
    const result = await diff.runPipeline(templateSelected.id);
    await diff.save(risId, diff.improveOutput(result.diffList), templateSelected.id);
  }

  start(timeoutString: string) {
    if (!timeoutString) {
      throw new Error('No timeout string "CRIS_SYNC_TIME" provided')
    }

    const timeout = parseTimeoutString(timeoutString)
    log.info(`Starting the CRIS -> DB sync process for ${timeoutString} (${timeout} seconds)`)

    setTimeout(() => {
      try {
        log.info('Timeout reached')
        this.process()
        this.start(timeoutString)
      } catch (error) {
        log.error('Error in timeout', error)
      }
    }, timeout * 1000)
  }
}
