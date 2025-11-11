/*
  Warnings:

  - Added the required column `crisUUID` to the `Diff` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Diff" ADD COLUMN     "crisUUID" TEXT NOT NULL;
