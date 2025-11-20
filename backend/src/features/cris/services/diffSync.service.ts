import { CRIS } from "@/features/cris/cris.model.js";
import CrisAPI from './cris.api.service.js';
import ExportSaveService from './execute-save.service.js';
import prisma from '@/lib/prisma.js';

import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: 'feature:cris:diffSync' });

export default class DiffSyncService {
  constructor(private cris: CRIS) { }

  async sync() {
    log.info("Diff sync service", { crisId: this.cris.id });

    const crisId = this.cris.id

    const crisAPI = new CrisAPI("", "");
    await crisAPI.setByCrisId(crisId)
    const exportSaveService = new ExportSaveService(crisAPI)

    const projects = await prisma.project.findMany({
      where: {
        externalEntities: {
          some: {
            crisId,
            SavedTemplate: {
              some: {}
            }
          }
        }
      },
      include: {
        externalEntities: {
          include: {
            SavedTemplate: true
          },
          where: {
            SavedTemplate: {
              some: {}
            }
          }
        }
      }
    })

    log.debug("# Projects:", projects.length)
    const totalEntitiesUpdated = []
    const startTime = new Date()
    for (const project of projects) {
      const { risId } = project
      log.info(`-> Project ${risId}`);
      log.debug("-- externalEntities", project.externalEntities.length)

      for (const externalEntity of project.externalEntities) {
        const { uuid, SavedTemplate, templateType } = externalEntity

        log.trace(`---- UUID: ${uuid} for ${SavedTemplate.length} templateType ${templateType}`)
        for (const savedTemplate of SavedTemplate) {
          const { templateId, settings } = savedTemplate;
          log.debug(`------ Saved Template: ID ${templateId}, Settings: ${JSON.stringify(settings)}`);

          /////////////// This is where do the diffing happend ///////////////
          var saved = await exportSaveService.executeAndSave(
            risId,
            crisId,
            templateType,
            uuid,
            templateId,
            settings
          )

          // sleep 1.5 second
          await new Promise(resolve => setTimeout(resolve, 1500));

          totalEntitiesUpdated.push(saved) // todo
        }
      }
      log.info(`-< Project ${risId}`);
    }

    // how much time it took us
    const endTime = new Date();
    const durationInSeconds = (endTime.getTime() - startTime.getTime()) / 1000;
    log.debug("Duration:", `${durationInSeconds.toFixed(2)} seconds`);

    log.debug('Total Projects:', projects.length)
    log.debug('Total Entities:', totalEntitiesUpdated.length)
  }
}
