import { promises as fs } from 'fs'

import { Logger } from "tslog";
const log = new Logger({ name: 'view:ri' });

import { projectETL2cluster } from '../ris-pure-etl/index'
import { callRIApi } from '../utils/ri-api'

import { Template } from '../models/Template'

export async function uploadProjectApplicationClusters(project: any, template: any, ris, settings) {
  const { applicationClusters, awardClusters } = project

  var applicationUUID
  var awardUUID
  if (applicationClusters && awardClusters) {
    // log.warn ('Application and Award clusters', applicationClusters, awardClusters)
    // GET
    //   ​/projects​/{uuid}​/application-clusters
    // Get the application clusters for the project
    // applicationUUID = await callRIApi(`/projects/${project.uuid}/application-clusters`, 'GET')
    // const foo = await callRIApi(`/applications/${applicationClusters[0].uuid}`, 'GET')
    // log.warn('foo: ', foo)

    // GET
    //   ​/projects​/{uuid}​/award-clusters
    // Get the award clusters for the project
    // awardUUID = await callRIApi(`/projects/${project.uuid}/award-clusters`, 'GET')
    // log.info(`Award UUID: ${awardUUID}`)
  }

  log.debug('applicaiton', applicationClusters)
  log.debug('award', awardClusters)

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
  } else {
    // update the applicationClusters
    // const applicationCluster = applicationClusters[0]
    // const { yamlTemplate } = await Template.getById(template.applicationId)
    // const data = await projectETL2cluster(yamlTemplate, ris, settings)
    // const application = await callRIApi(`/applications/${applicationCluster.uuid}`, 'PUT', data)
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
  } else {
    // update the awardClusters
    // const awardCluster = awardClusters[0]
    // const { yamlTemplate } = await Template.getById(template.awardId)
    // const data = await projectETL2cluster(yamlTemplate, ris, settings)
    // const award = await callRIApi(`/awards/${awardCluster.uuid}`, 'PUT', data)
  }

  log.info(`Project uuid: ${project.uuid}`)

  if (!applicationUUID && !awardUUID) {
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
}
