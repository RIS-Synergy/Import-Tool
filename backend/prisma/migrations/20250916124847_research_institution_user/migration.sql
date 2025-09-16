-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_researchInstitutionId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "researchInstitutionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_researchInstitutionId_fkey" FOREIGN KEY ("researchInstitutionId") REFERENCES "ResearchInstitution"("id") ON DELETE SET NULL ON UPDATE CASCADE;
