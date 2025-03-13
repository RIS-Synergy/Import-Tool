/*
  Warnings:

  - The primary key for the `Diff` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `risId` on the `Diff` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Diff" DROP CONSTRAINT "Diff_risId_fkey";

-- DropIndex
DROP INDEX "Diff_risId_key";

-- AlterTable
ALTER TABLE "Diff" DROP CONSTRAINT "Diff_pkey",
DROP COLUMN "risId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Diff_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Diff_id_seq";

-- AddForeignKey
ALTER TABLE "Diff" ADD CONSTRAINT "Diff_id_fkey" FOREIGN KEY ("id") REFERENCES "Project"("risId") ON DELETE RESTRICT ON UPDATE CASCADE;
