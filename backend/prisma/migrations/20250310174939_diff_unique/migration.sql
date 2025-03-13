/*
  Warnings:

  - You are about to drop the column `projectId` on the `Diff` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[risId]` on the table `Diff` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `risId` to the `Diff` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Diff" DROP CONSTRAINT "Diff_projectId_fkey";

-- AlterTable
ALTER TABLE "Diff" DROP COLUMN "projectId",
ADD COLUMN     "risId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Diff_risId_key" ON "Diff"("risId");

-- AddForeignKey
ALTER TABLE "Diff" ADD CONSTRAINT "Diff_risId_fkey" FOREIGN KEY ("risId") REFERENCES "Project"("risId") ON DELETE RESTRICT ON UPDATE CASCADE;
