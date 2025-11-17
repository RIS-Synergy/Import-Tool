/*
  Warnings:

  - You are about to drop the column `templateType` on the `SavedTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `yamlTemplate` on the `SavedTemplate` table. All the data in the column will be lost.
  - You are about to drop the `Diff` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[projectId,templateId,externalEntityId]` on the table `SavedTemplate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `externalEntityId` to the `SavedTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modifiedDate` to the `SavedTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Diff" DROP CONSTRAINT "Diff_crisId_fkey";

-- DropForeignKey
ALTER TABLE "Diff" DROP CONSTRAINT "Diff_savedTemplateId_fkey";

-- AlterTable
ALTER TABLE "SavedTemplate" DROP COLUMN "templateType",
DROP COLUMN "yamlTemplate",
ADD COLUMN     "changed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "diffList" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "externalEntityId" INTEGER NOT NULL,
ADD COLUMN     "modifiedDate" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Diff";

-- CreateIndex
CREATE UNIQUE INDEX "SavedTemplate_projectId_templateId_externalEntityId_key" ON "SavedTemplate"("projectId", "templateId", "externalEntityId");

-- AddForeignKey
ALTER TABLE "SavedTemplate" ADD CONSTRAINT "SavedTemplate_externalEntityId_fkey" FOREIGN KEY ("externalEntityId") REFERENCES "ExternalEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
