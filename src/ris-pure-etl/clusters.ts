import { promises as fs } from 'fs'

import { Logger } from "tslog";
const log = new Logger({ name: 'view:ri'});

import { projectETL2, projectETL2cluster } from '../ris-pure-etl/index'
import { callRIApi } from '../utils/ri-api'

export async function uploadProjectApplicationClusters (project: any) {
  const yamlBuffer = await fs.readFile('./resources/transformers/application.yaml')
  const yamlContent = yamlBuffer.toString()
  const pure = await projectETL2cluster(yamlContent, {}, {})

  var applicationUUID = null

  if (!project['applicationClusters']) {
    // create an application
    const application = await callRIApi('/applications', 'PUT', pure)

    // add the application to the project
    const projectResult = await callRIApi(`/projects/${project.uuid}`, 'PUT', {
      ...project,
      applicationClusters: [
        {
          uuid: application.cluster.uuid,
          systemName: "ApplicationCluster",
        }
      ]
    })
    log.info(`Add applicationClusters to project ${project.pureId}`, projectResult.applicationClusters)
  } else {
    log.debug ('ApplicationClusters already exist. Skipping.')
  }
}
