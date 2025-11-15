/*
  Warnings:

  - A unique constraint covering the columns `[savedTemplateId,crisId,crisUUID]` on the table `Diff` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Diff_savedTemplateId_crisId_crisUUID_key" ON "Diff"("savedTemplateId", "crisId", "crisUUID");
