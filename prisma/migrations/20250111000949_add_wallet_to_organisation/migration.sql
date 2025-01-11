/*
  Warnings:

  - A unique constraint covering the columns `[walletId]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_agentId_fkey";

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "walletId" TEXT;

-- AlterTable
ALTER TABLE "Wallet" ALTER COLUMN "agentId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Organization_walletId_key" ON "Organization"("walletId");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
