import { PrismaClient } from '@prisma/client'
import { execSync } from 'node:child_process'
import process from 'node:process'

const prisma = new PrismaClient()

async function reset() {
  console.log('🔄 Syncing database schema...')
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });

  console.log('🗑️ Clearing existing data...')
  try {
    // Clear all data
    await prisma.savedTemplate.deleteMany();
    await prisma.externalEntity.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
    await prisma.researchInstitution.deleteMany();
  } catch (e) {
    console.log('⚠️ Could not clear some tables (they might be empty or missing):', (e as any).message);
  }

  console.log('✅ Database cleared.')
  
  console.log('🌱 Re-seeding database...')
  // Using node:child_process to run db-initiate.ts logic, but bypass checkEmpty
  // Since we've cleared the DB, db-initiate.ts's checkEmpty will pass.
  
  execSync('yarn tsx ./scripts/db-initiate.ts', { stdio: 'inherit' });
  
  console.log('🚀 Test database is ready.')
}

reset()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
