import { Logger } from "tslog"
import { ResearchInstitution } from "./ResearchInstitution"
import { Diff } from "./Diff";
import { Template } from "./Template";
const log = new Logger({ name: "DiffSync" });

import { parseTimeoutString } from "../utils/sync";

type FoundDiff = {
  risId: string;
  templateId: number;
  diffs: any[];
};

const ri = new ResearchInstitution()

export class DiffSync {
  foundDiffs: FoundDiff[] = []

  async process() {
    this.foundDiffs = []
    try {
      log.debug('Processing DiffSync');
      const result = await ri.getAllProjects("Project");
      await this.processItems(result.items);
    } catch (error) {
      log.error('Error processing DiffSync', error);
    }
    if (this.foundDiffs.length > 0) {
      log.info('Found', this.foundDiffs.length, "Project", 'diffs')
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
    const improved = diff.improveOutput(result.diffList)
    if (improved.length > 0) {
      this.foundDiffs.push({
        risId,
        templateId: templateSelected.id,
        diffs: improved
      })
    }
    await diff.save(risId, improved, templateSelected.id);
  }

  /* istanbul ignore next */
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
