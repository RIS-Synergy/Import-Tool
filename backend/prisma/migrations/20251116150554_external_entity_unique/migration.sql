/*
  Warnings:

  - A unique constraint covering the columns `[projectId,crisId,uuid,templateType]` on the table `ExternalEntity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ExternalEntity_projectId_crisId_uuid_templateType_key" ON "ExternalEntity"("projectId", "crisId", "uuid", "templateType");
