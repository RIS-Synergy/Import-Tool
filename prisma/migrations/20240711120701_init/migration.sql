-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "risId" TEXT NOT NULL,
    "risData" JSONB NOT NULL DEFAULT '{}',
    "crisId" TEXT,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_risId_key" ON "Project"("risId");
