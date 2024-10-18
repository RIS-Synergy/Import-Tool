/*
  Warnings:

  - You are about to drop the column `settings` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `template` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "settings",
DROP COLUMN "template";

-- CreateTable
CREATE TABLE "SavedTemplate" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "templateId" INTEGER NOT NULL,
    "settingsData" JSONB NOT NULL DEFAULT '{}',
    "templateData" JSONB NOT NULL DEFAULT '{}',
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedTemplate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SavedTemplate" ADD CONSTRAINT "SavedTemplate_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedTemplate" ADD CONSTRAINT "SavedTemplate_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
