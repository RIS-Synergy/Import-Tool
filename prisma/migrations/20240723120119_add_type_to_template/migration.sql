/*
  Warnings:

  - Added the required column `type` to the `Template` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TemplateType" AS ENUM ('PROJECT', 'APPLICATION', 'AWARD');

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "type" "TemplateType" NOT NULL;
