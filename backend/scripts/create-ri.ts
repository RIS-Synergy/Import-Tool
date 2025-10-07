import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import prisma from '../src/lib/prisma.js';
import { ResearchInstitutionService } from '../src/features/research-institution/services/research-institution.service.js';

async function extractRorIdsFromProjects() {
  // Query to find all unique ROR IDs in the projects' risData
  const query = `
        SELECT DISTINCT jsonb_path_query(
            p."risData"::jsonb,
            '$.funded[*].as.recipients[*].orgUnit.identifiers[*].value'
        ) as ror_id
        FROM "Project" p
        WHERE jsonb_path_exists(
            p."risData"::jsonb,
            '$.funded[*].as.recipients[*].orgUnit.identifiers[*]'
        )
    `;

  const result: any[] = await prisma.$queryRawUnsafe(query);
  return result.map(item => item.ror_id).filter(Boolean);
}

async function getExistingRorIds() {
  const institutions = await prisma.researchInstitution.findMany({
    select: {
      rorId: true
    }
  });
  return institutions.map(inst => inst.rorId);
}

async function findMissingRorIds() {
  const allRorIds = await extractRorIdsFromProjects();
  const existingRorIds = await getExistingRorIds();

  // Find ROR IDs that are in projects but not in the research institutions table
  const missingRorIds = allRorIds.filter(rorId =>
    !existingRorIds.includes(rorId) &&
    rorId &&
    typeof rorId === 'string' &&
    rorId.length > 0
  );

  return missingRorIds;
}

async function getInstitutionInfoFromRorId(rorId: string) {
  // Try to find the institution name from any project
  const query = `
        SELECT
            jsonb_path_query_first(
                p."risData"::jsonb,
                '$.funded[*].as.recipients[*].orgUnit ? (@.identifiers[*].value == "${rorId}").name'
            ) as name
        FROM "Project" p
        WHERE jsonb_path_exists(
            p."risData"::jsonb,
            '$.funded[*].as.recipients[*].orgUnit.identifiers[*] ? (@.value == "${rorId}")'
        )
        LIMIT 1
    `;

  const result: any[] = await prisma.$queryRawUnsafe(query);
  if (result.length > 0 && result[0].name) {
    return {
      name: result[0].name[0].text,
      rorId: rorId.replace('https://ror.org/', '')
    };
  }
  return null;
}

async function createMissingResearchInstitutions() {
  try {
    const missingRorIds = await findMissingRorIds();
    console.log(`Found ${missingRorIds.length} missing ROR IDs`);

    for (const rorId of missingRorIds) {
      const institutionInfo = await getInstitutionInfoFromRorId(rorId);
      if (institutionInfo) {
        // First, check if an institution with the same name already exists
        const existingByName = await prisma.researchInstitution.findFirst({
          where: {
            name: institutionInfo.name
          }
        });

        if (existingByName) {
          // Update the existing record with the rorId
          await prisma.researchInstitution.update({
            where: { id: existingByName.id },
            data: {
              rorId: institutionInfo.rorId
            }
          });
          console.log(`Updated research institution: ${institutionInfo.name} (${institutionInfo.rorId})`);
        } else {
          // Check if an institution with the same rorId exists
          const existingByRorId = await prisma.researchInstitution.findFirst({
            where: {
              rorId: institutionInfo.rorId
            }
          });

          if (existingByRorId) {
            // Update the existing record
            await prisma.researchInstitution.update({
              where: { id: existingByRorId.id },
              data: {
                name: institutionInfo.name
              }
            });
            console.log(`Updated research institution: ${institutionInfo.name} (${institutionInfo.rorId})`);
          } else {
            // Create new institution
            await prisma.researchInstitution.create({
              data: {
                name: institutionInfo.name,
                rorId: institutionInfo.rorId
              }
            });
            console.log(`Created research institution: ${institutionInfo.name} (${institutionInfo.rorId})`);
          }
        }
      } else {
        console.log(`Could not find info for ROR ID: ${rorId}`);
      }
    }

    console.log('Finished processing missing research institutions');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function importDomains() {
  const service = new ResearchInstitutionService();
  await service.importDomains();
}

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('domains-file', {
      type: 'boolean',
      description: 'Import domains from the domains file',
      default: false
    })
    .parse();

  try {
    if (argv.domainsFile) {
      console.log('Importing domains...');
      await importDomains();
    } else {
      console.log('Creating missing research institutions...');
      await createMissingResearchInstitutions();
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the main function
main();
