import prisma from '@/lib/prisma.js';

import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: 'feature:cris:getDiff' });

// Get the latest diff for a given risId and crisId
export async function getDiff(
  risId: string,
  systemName: string,
  externalEntityId: number,
): Promise<any> {
  try {
    const diffs = await prisma.savedTemplate.findFirst({
      where: {
          project: {
            risId
          },
          template: {
            templateType: systemName.toUpperCase(),
          },
          externalEntityId,
      },
      orderBy: {
        createdDate: "desc",
      },
    });

    // log.debug("Diffs fetched:", diffs);
    return diffs;
  } catch (error) {
    log.error("Error fetching diff", error);
    throw error;
  }
}
