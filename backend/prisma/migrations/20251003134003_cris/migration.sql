-- CreateTable
CREATE TABLE "CRIS" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "apiUrl" TEXT NOT NULL DEFAULT '',
    "data" JSONB NOT NULL DEFAULT '{}',
    "researchInstitutionId" INTEGER,

    CONSTRAINT "CRIS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CRIS_researchInstitutionId_name_key" ON "CRIS"("researchInstitutionId", "name");

-- AddForeignKey
ALTER TABLE "CRIS" ADD CONSTRAINT "CRIS_researchInstitutionId_fkey" FOREIGN KEY ("researchInstitutionId") REFERENCES "ResearchInstitution"("id") ON DELETE SET NULL ON UPDATE CASCADE;
