-- DropIndex
DROP INDEX "ResearchInstitution_name_key";

-- AlterTable
ALTER TABLE "CRIS" ADD COLUMN     "apiKey" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "ResearchInstitution" ALTER COLUMN "name" DROP NOT NULL;
