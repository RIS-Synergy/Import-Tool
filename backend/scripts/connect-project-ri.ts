import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import prisma from '../src/lib/prisma.js';
import { ResearchInstitutionService } from '../src/features/research-institution/services/research-institution.service.js';

async function getAllResearchInstitutions() {
  const service = new ResearchInstitutionService();
  return await service.findAll();
}

async function getProjectsForResearchInstitution(rorId: string) {
  // Validate rorId to be alphanumeric to prevent SQL injection
  if (!/^[a-zA-Z0-9]+$/.test(rorId)) {
    throw new Error(`Invalid ROR ID: ${rorId}`);
  }

  // Using Prisma's raw query to match the SQL condition
  // Note: We need to use template literals here because the path can't be parameterized
  const query = `
        SELECT
            p.*,
            d.length AS "diffLength",
            d.list AS "diffList"
        FROM "Project" p
        LEFT JOIN "Diff" d
            ON p."risId" = d.id
        WHERE jsonb_path_exists(
            p."risData"::jsonb,
            '$.funded[*].as.recipients[*].orgUnit.identifiers[*] ? (@.value like_regex "${rorId}")'
        )
    `;

  const projects = await prisma.$queryRawUnsafe(query);
  return projects;
}

async function connectProjectToResearchInstitution(projectId: number, researchInstitutionId: number) {
  await prisma.project.update({
    where: { id: projectId },
    data: {
      researchInstitutions: {
        connect: { id: researchInstitutionId }
      }
    }
  });
}

async function analyzeProjectConnections() {
  try {
    // Get all projects with their research institution connections count
    const projectsWithConnections = await prisma.project.findMany({
      include: {
        researchInstitutions: {
          select: {
            id: true
          }
        }
      }
    });

    // Categorize projects
    const zeroConnections = [];
    const oneConnection = [];
    const multipleConnections = [];

    for (const project of projectsWithConnections) {
      const connectionCount = project.researchInstitutions.length;

      if (connectionCount === 0) {
        zeroConnections.push(project);
      } else if (connectionCount === 1) {
        oneConnection.push(project);
      } else {
        multipleConnections.push(project);
      }
    }

    console.log('\nProject Connection Analysis:');
    console.log(`Projects with 0 connections: ${zeroConnections.length}`);
    console.log(`Projects with 1 connection: ${oneConnection.length}`);
    console.log(`Projects with multiple connections: ${multipleConnections.length}`);
    console.log(`Projects with connections: ${oneConnection.length + multipleConnections.length}`);

    // Log some examples if needed
    if (zeroConnections.length > 0) {
      console.log('\nExamples of projects with 0 connections:');
      for (let i = 0; i < Math.min(3, zeroConnections.length); i++) {
        console.log(`  - ${zeroConnections[i].risId}`);
      }
    }

    if (multipleConnections.length > 0) {
      console.log('\nExamples of projects with multiple connections:');
      for (let i = 0; i < Math.min(3, multipleConnections.length); i++) {
        console.log(`  - ${multipleConnections[i].risId}: ${multipleConnections[i].researchInstitutions.length} connections`);
      }
    }

    return {
      zeroConnections,
      oneConnection,
      multipleConnections
    };
  } catch (error) {
    console.error('Error analyzing project connections:', error);
    throw error;
  }
}

interface CliOptions {
  connect: boolean;
  analysis: boolean;
}

async function mainWithOptions(options: CliOptions) {
  try {
    if (options.connect) {
      const researchInstitutions = await getAllResearchInstitutions();

      for (const institution of researchInstitutions) {
        console.log(`Processing institution: ${institution.name} (ROR: ${institution.rorId})`);

        // Get projects that match the ROR ID pattern
        var projects: any[];
        try {
          projects = await getProjectsForResearchInstitution(institution.rorId);
        } catch (error) {
          console.error(`Error fetching projects for ROR ID ${institution.rorId}:`, error);
          continue; // Skip to the next institution
        }

        console.log(`Found ${projects.length} projects for ${institution.name}`);

        // Connect each project to the research institution
        for (const project of projects) {
          await connectProjectToResearchInstitution(project.id, institution.id);
          console.log(`Connected project ${project.risId} to ${institution.name}`);
        }
      }

      console.log('Finished connecting projects to research institutions');
    }

    if (options.analysis) {
      // Analyze the connections
      await analyzeProjectConnections();
    }

    // If neither option is specified, show help
    if (!options.connect && !options.analysis) {
      console.log('No actions specified. Use --connect or --analysis flags.');
      console.log('Run with --help for more information.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Setup yargs
const argv = yargs(hideBin(process.argv))
  .option('connect', {
    type: 'boolean',
    default: false,
    description: 'Connect projects to research institutions based on ROR IDs'
  })
  .option('analysis', {
    type: 'boolean',
    default: false,
    description: 'Analyze project connections to research institutions'
  })
  .help()
  .alias('help', 'h')
  .parseSync();

// Run the main function with CLI options
mainWithOptions(argv);
