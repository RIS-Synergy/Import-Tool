import { promises as fs } from 'fs'

import { Logger } from "tslog";
const log = new Logger({ name: 'view:ri' });

import { projectETL2cluster } from '../ris-pure-etl/index'
import { callRIApi } from '../utils/ri-api'

import { Template } from '../models/Template'

export async function uploadProjectApplicationClusters(project: any, template: any, ris, settings) {
  const { applicationClusters, awardClusters } = project

  if (applicationClusters && awardClusters) {
    log.debug('ApplicationClusters and AwardClusters already exist. Skipping.')
    return
  }

  var applicationPureId = null
  if (!applicationClusters) {
    const { yamlTemplate } = await Template.getById(template.applicationId)
    const data = await projectETL2cluster(yamlTemplate, ris, settings)
    const application = await callRIApi('/applications', 'PUT', data)
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
    const { yamlTemplate } = await Template.getById(template.awardId)
    const data = await projectETL2cluster(yamlTemplate, ris, settings)
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
  log.debug(`Update Project ${projectResult.pureId} to include application and award clusters`, [
    {
      ...projectResult.applicationClusters[0],
      applicationPureId
    },
    {
      ...projectResult.awardClusters[0],
      awardPureId
    }
  ])

  return projectResult
}
