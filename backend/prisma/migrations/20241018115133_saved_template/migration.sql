/*
  Warnings:

  - You are about to drop the column `projectId` on the `SavedTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `settingsData` on the `SavedTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `templateData` on the `SavedTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `templateId` on the `SavedTemplate` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SavedTemplate" DROP CONSTRAINT "SavedTemplate_projectId_fkey";

-- DropForeignKey
ALTER TABLE "SavedTemplate" DROP CONSTRAINT "SavedTemplate_templateId_fkey";

-- AlterTable
ALTER TABLE "SavedTemplate" DROP COLUMN "projectId",
DROP COLUMN "settingsData",
DROP COLUMN "templateData",
DROP COLUMN "templateId",
ADD COLUMN     "settings" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "template" JSONB NOT NULL DEFAULT '{}';
