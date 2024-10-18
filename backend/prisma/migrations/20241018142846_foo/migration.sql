/*
  Warnings:

  - You are about to drop the column `yamlTemplate` on the `SavedTemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SavedTemplate" DROP COLUMN "yamlTemplate",
ADD COLUMN     "saveData" JSONB NOT NULL DEFAULT '{}';
