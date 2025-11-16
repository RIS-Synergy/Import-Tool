-- CreateTable
CREATE TABLE "ExternalEntity" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT,
    "templateType" "TemplateType" NOT NULL DEFAULT 'PROJECT',
    "projectId" INTEGER NOT NULL,
    "crisId" INTEGER NOT NULL,

    CONSTRAINT "ExternalEntity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExternalEntity" ADD CONSTRAINT "ExternalEntity_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalEntity" ADD CONSTRAINT "ExternalEntity_crisId_fkey" FOREIGN KEY ("crisId") REFERENCES "CRIS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
