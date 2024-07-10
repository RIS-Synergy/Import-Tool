-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('IN_PREPERATION', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'REJECTED');

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "risid" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'IN_PREPERATION',
    "data" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_risid_key" ON "Project"("risid");
