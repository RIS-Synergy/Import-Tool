import { promises as fs } from 'fs'

import { Logger } from "tslog";
const log = new Logger({ name: 'view:ri'});

import { projectETL2, projectETL2cluster } from '../ris-pure-etl/index'
import { callRIApi } from '../utils/ri-api'

async function getApplicationData () {
  const yamlBuffer = await fs.readFile('./resources/transformers/application.yaml')
  const yamlContent = yamlBuffer.toString()
  const pure = await projectETL2cluster(yamlContent, {}, {})
  return pure
}

async function getAwardData () {
  const yamlBuffer = await fs.readFile('./resources/transformers/award.yaml')
  const yamlContent = yamlBuffer.toString()
  const pure = await projectETL2cluster(yamlContent, {}, {})
  return pure
}

export async function uploadProjectApplicationClusters (project: any) {
  const { applicationClusters, awardClusters } = project

  if (applicationClusters && awardClusters) {
    log.debug ('ApplicationClusters and AwardClusters already exist. Skipping.')
    return
  }

  var applicationPureId = null
  if (!applicationClusters) {
    const data = await getApplicationData()
    const application = await callRIApi('/applications', 'PUT', data)

    log.info('Application', application)

    applicationPureId = application.pureId
    project.applicationClusters = [
      {
        uuid: application.cluster.uuid,
        systemName: "ApplicationCluster",
      }
    ]
  }

  var awardPureId = null
  if (!awardClusters) {
    const data = await getAwardData()
    const award = await callRIApi('/awards', 'PUT', data)
    awardPureId = award.pureId
    project.awardClusters = [
      {
        uuid: award.cluster.uuid,
        systemName: "AwardCluster",
      }
    ]
  }

  log.info(`Project uuid: ${project.uuid}`)

  const projectResult = await callRIApi(`/projects/${project.uuid}`, 'PUT', project)
  log.info(`Update Project ${projectResult.pureId} to include application and award clusters`, [
    {
      ...projectResult.applicationClusters[0],
      applicationPureId
    },
    {
      ...projectResult.awardClusters[0],
      awardPureId
    }
  ])
}
