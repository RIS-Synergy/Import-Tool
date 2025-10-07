import prisma from '@/lib/prisma.js';

type InstitutionDomain = {
  name: string
  domain: string
  ror: string
}

export async function importDomains(domains: InstitutionDomain[]) {
  try {
    for (const item of domains) {
      const { name, domain } = item;

      // Extract the ROR ID from the URL
      const rorId = item.ror.replace('https://ror.org/', '');

      // Check if a research institution with this rorId already exists
      const existingInstitution = await prisma.researchInstitution.findFirst({
        where: {
          rorId
        }
      });

      if (existingInstitution) {
        // Update the existing record with new data
        await prisma.researchInstitution.update({
          where: { id: existingInstitution.id },
          data: {
            name,
            domain,
            rorId
          }
        });
        // console.log(`Updated research institution: ${name} (${rorId})`);
      } else {
        // Create new institution
        await prisma.researchInstitution.create({
          data: {
            name,
            domain,
            rorId
          }
        });
        // console.log(`Created research institution: ${name} (${rorId})`);
      }
    }
    console.log('Import completed successfully');
  } catch (error) {
    console.error('Error importing domains:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
