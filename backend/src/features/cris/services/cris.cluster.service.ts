import CrisAPI from './cris.api.service.js';

import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: 'feature:cris:cluster:service' });

export default class ClusterService {
  constructor(private crisAPI: CrisAPI) {}

  private getProjectData(endpoint: string) {
    try {
      return this.crisAPI.get(endpoint)
    } catch (error) {
      log.error('Error fetching CRIS data', error);
      throw error;
    }
  }

  private modifyCluster(systemName: string, clusterUUID: string, projectData: object) {
    // set cluster data
    projectData[`${systemName.toLowerCase()}Clusters`] = [
      {
        uuid: clusterUUID,
        systemName: systemName + 'Cluster',
      }
    ]
    return projectData
  }

  async assignCluster(
    projectUUID: string,
    applicationUUID?: string,
    awardUUID?: string
  ) {
    // Implementation of assignCluster method
    log.info('Assigning cluster with params:', {
      projectUUID,
      applicationUUID,
      awardUUID
    });

    // Fetch project data based on provided UUIDs and modify it
    const endpoint = `/projects/${projectUUID}`;
    var projectData = null

    if (applicationUUID) {
      var projectData = await this.getProjectData(endpoint);
      projectData = this.modifyCluster('Application', applicationUUID, projectData);
    }
    else if (awardUUID) {
      var projectData = await this.getProjectData(endpoint);
      projectData = this.modifyCluster('Award', awardUUID, projectData);
    } else {
      throw new Error('Either applicationUUID or awardUUID must be provided');
    }

    // Update project with cluster info
    const result = await this.crisAPI.put(
      `/projects/${projectUUID}`,
      projectData
    );
    return result;
  }
}
