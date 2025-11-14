import prisma from '@/lib/prisma.js';

import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: 'feature:cris:getDiff' });

// Get the latest diff for a given risId and crisId
export async function getDiff(
  risId: string,
  crisId: number,
  systemName: string,
  useSavedTemplate = false,
  useCris = false
): Promise<any> {
  // log.info(`Fetching diff for risId: ${risId}, crisId: ${crisId}, systemName: ${systemName}`);
  try {
    const diffs = await prisma.diff.findFirst({
      where: {
        crisId,
        savedTemplate: {
          project: {
            risId, // filter by risId
          },
          templateType: systemName.toUpperCase(),
        },
      },
      include: {
        savedTemplate: useSavedTemplate,
        cris: useCris
      },
      orderBy: {
        createdDate: "desc",
      },
    });
    // log.debug('Diffs fetched:', diffs)
    return diffs
  } catch (error) {
    log.error('Error fetching diff', error);
    throw error;
  }
}
