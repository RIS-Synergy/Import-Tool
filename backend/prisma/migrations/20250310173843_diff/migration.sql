-- CreateTable
CREATE TABLE "Diff" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "templateId" INTEGER NOT NULL,
    "length" INTEGER NOT NULL,
    "list" JSONB NOT NULL DEFAULT '[]',
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diff_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Diff" ADD CONSTRAINT "Diff_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diff" ADD CONSTRAINT "Diff_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
