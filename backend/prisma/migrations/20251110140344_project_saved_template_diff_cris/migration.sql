/*
  Warnings:

  - The primary key for the `Diff` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `length` on the `Diff` table. All the data in the column will be lost.
  - You are about to drop the column `list` on the `Diff` table. All the data in the column will be lost.
  - You are about to drop the column `templateId` on the `Diff` table. All the data in the column will be lost.
  - The `id` column on the `Diff` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `crisId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `crisUUID` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `saveData` on the `SavedTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `template` on the `SavedTemplate` table. All the data in the column will be lost.
  - Added the required column `crisId` to the `Diff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endpoint` to the `Diff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `savedTemplateId` to the `Diff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `templateId` to the `SavedTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Diff" DROP CONSTRAINT "Diff_id_fkey";

-- DropForeignKey
ALTER TABLE "Diff" DROP CONSTRAINT "Diff_templateId_fkey";

-- AlterTable
ALTER TABLE "Diff" DROP CONSTRAINT "Diff_pkey",
DROP COLUMN "length",
DROP COLUMN "list",
DROP COLUMN "templateId",
ADD COLUMN     "changed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "crisId" INTEGER NOT NULL,
ADD COLUMN     "diffList" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "endpoint" TEXT NOT NULL,
ADD COLUMN     "method" TEXT NOT NULL DEFAULT 'POST',
ADD COLUMN     "savedTemplateId" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Diff_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "crisId",
DROP COLUMN "crisUUID";

-- AlterTable
ALTER TABLE "SavedTemplate" DROP COLUMN "saveData",
DROP COLUMN "template",
ADD COLUMN     "risData" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "templateId" INTEGER NOT NULL,
ADD COLUMN     "yamlTemplate" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "SavedTemplate" ADD CONSTRAINT "SavedTemplate_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diff" ADD CONSTRAINT "Diff_savedTemplateId_fkey" FOREIGN KEY ("savedTemplateId") REFERENCES "SavedTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diff" ADD CONSTRAINT "Diff_crisId_fkey" FOREIGN KEY ("crisId") REFERENCES "CRIS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
