import { callCrisApi } from './cris.api.service.js';

import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: 'feature:cris:cluster:service' });

export default class ClusterService {
  constructor(
    private apiUrl: string,
    private apiKey: string,
  ) {}

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
  }
}
