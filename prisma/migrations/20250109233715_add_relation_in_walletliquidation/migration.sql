/*
  Warnings:

  - You are about to drop the column `AgentId` on the `WalletLiquidation` table. All the data in the column will be lost.
  - Added the required column `agentId` to the `WalletLiquidation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WalletLiquidation" DROP COLUMN "AgentId",
ADD COLUMN     "agentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "WalletLiquidation" ADD CONSTRAINT "WalletLiquidation_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletLiquidation" ADD CONSTRAINT "WalletLiquidation_validatedByAgentId_fkey" FOREIGN KEY ("validatedByAgentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
