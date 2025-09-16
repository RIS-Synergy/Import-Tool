/*
  Warnings:

  - Added the required column `researchInstitutionId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "permission" TEXT[] DEFAULT ARRAY['edit']::TEXT[],
ADD COLUMN     "researchInstitutionId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ResearchInstitution" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "rorId" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResearchInstitution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResearchInstitution_name_key" ON "ResearchInstitution"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchInstitution_domain_key" ON "ResearchInstitution"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchInstitution_rorId_key" ON "ResearchInstitution"("rorId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_researchInstitutionId_fkey" FOREIGN KEY ("researchInstitutionId") REFERENCES "ResearchInstitution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
