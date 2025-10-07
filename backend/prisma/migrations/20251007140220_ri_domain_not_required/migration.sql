-- DropIndex
DROP INDEX "ResearchInstitution_domain_key";

-- AlterTable
ALTER TABLE "ResearchInstitution" ALTER COLUMN "domain" DROP NOT NULL;
