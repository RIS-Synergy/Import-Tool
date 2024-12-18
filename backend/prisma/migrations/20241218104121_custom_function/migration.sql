-- CreateTable
CREATE TABLE "CustomFunction" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "code" TEXT NOT NULL DEFAULT '',
    "language" TEXT NOT NULL DEFAULT 'javascript',
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomFunction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomFunction_name_key" ON "CustomFunction"("name");
