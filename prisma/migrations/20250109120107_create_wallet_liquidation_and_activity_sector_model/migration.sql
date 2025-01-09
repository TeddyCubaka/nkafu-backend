-- CreateTable
CREATE TABLE "WalletLiquidation" (
    "id" TEXT NOT NULL,
    "endAt" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "OperationStatus" NOT NULL,
    "startAt" TEXT NOT NULL,
    "AgentId" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "validatedByAgentId" TEXT,
    "meta" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN DEFAULT false,
    "updatedByUserId" TEXT,
    "createdByUserId" TEXT,

    CONSTRAINT "WalletLiquidation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rfActivitySectors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "updateBy" TEXT,
    "createBy" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "meta" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "rfActivitySectors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WalletLiquidation_id_key" ON "WalletLiquidation"("id");

-- CreateIndex
CREATE UNIQUE INDEX "rfActivitySectors_id_key" ON "rfActivitySectors"("id");

-- CreateIndex
CREATE UNIQUE INDEX "rfActivitySectors_name_key" ON "rfActivitySectors"("name");

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_activitySectorId_fkey" FOREIGN KEY ("activitySectorId") REFERENCES "rfActivitySectors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletLiquidation" ADD CONSTRAINT "WalletLiquidation_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletLiquidation" ADD CONSTRAINT "WalletLiquidation_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
