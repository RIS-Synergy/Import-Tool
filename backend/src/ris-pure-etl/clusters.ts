import { Logger } from "tslog";
const log = new Logger({ name: 'clusters' });

import { projectETL2cluster } from '../ris-pure-etl/index'
import { callRIApi } from '../utils/ri-api'

import { Template } from '../models/Template'

async function findClusterEntityUUID (apiPath, title, uuid) {
  const result = await callRIApi(`${apiPath}/search`, 'POST', {
    size: 100,
    offset: 0,
    searchString: title
  })
  const item = result.items[0]

  // find uniqie list of items, that have x.cluster.uuid that is the same as the searchString
  if (item.cluster && item.cluster.uuid === uuid) {
    return result.items[0].uuid
  }

  return null
}

export async function uploadProjectApplicationClusters(project, template, ris, settings) {
  const { applicationClusters, awardClusters } = project;

  await handleCluster(applicationClusters, template.applicationId, "ApplicationCluster", "/applications", project, ris, settings);
  await handleCluster(awardClusters, template.awardId, "AwardCluster", "/awards", project, ris, settings);

  log.info(`Project uuid: ${project.uuid}`);
  return project;
}

async function handleCluster(cluster, templateId, systemName, apiPath, project, ris, settings) {
  const { yamlTemplate } = await Template.getById(templateId);
  const data = await projectETL2cluster(yamlTemplate, ris, settings);

  if (!cluster) {
    log.info(`No ${systemName.toLowerCase()}. Creating a new one.`);
    const response = await callRIApi(apiPath, 'PUT', data);

    project[`${systemName.toLowerCase()}s`] = [
      {
        uuid: response.cluster.uuid,
        systemName: systemName,
      }
    ];
  } else {
    log.info(`${systemName} found. Updating...`);
    const existingCluster = cluster[0]; // Assuming we update the first cluster in the array
    const title = project.title.en_GB
    const uuid = await findClusterEntityUUID(apiPath, title, existingCluster.uuid);

    await callRIApi(`${apiPath}/${uuid}`, 'PUT', data);
    log.info(`${systemName} updated with UUID: ${uuid}`);
  }
}
