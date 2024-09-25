-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "settings" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "template" JSONB NOT NULL DEFAULT '{}';
