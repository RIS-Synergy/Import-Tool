-- CreateTable
CREATE TABLE "FundingAgency" (
    "id" TEXT NOT NULL,
    "clientSecret" TEXT,
    "clientId" TEXT,
    "data" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "FundingAgency_pkey" PRIMARY KEY ("id")
);
