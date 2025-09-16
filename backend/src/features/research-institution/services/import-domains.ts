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

      // The domain must end with .ac.at
      if (!domain.endsWith('.ac.at')) {
        console.log(`Skipping domain ${domain}`)
        continue;
      }

      // Extract the ROR ID from the URL
      const rorId = item.ror.replace('https://ror.org/', '');

      // Insert (of Update) the research institution
      await prisma.researchInstitution.upsert({
        where: { domain: item.domain },
        update: {
          name,
          rorId
        },
        create: {
          name,
          domain,
          rorId
        },
      });
    }
    console.log('Import completed successfully');
  } catch (error) {
    console.error('Error importing domains:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
