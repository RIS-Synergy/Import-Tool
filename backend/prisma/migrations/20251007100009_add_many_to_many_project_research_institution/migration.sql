-- CreateTable
CREATE TABLE "_ProjectToResearchInstitution" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToResearchInstitution_AB_unique" ON "_ProjectToResearchInstitution"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToResearchInstitution_B_index" ON "_ProjectToResearchInstitution"("B");

-- AddForeignKey
ALTER TABLE "_ProjectToResearchInstitution" ADD CONSTRAINT "_ProjectToResearchInstitution_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToResearchInstitution" ADD CONSTRAINT "_ProjectToResearchInstitution_B_fkey" FOREIGN KEY ("B") REFERENCES "ResearchInstitution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
