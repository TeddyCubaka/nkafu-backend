-- DropForeignKey
ALTER TABLE "Operation" DROP CONSTRAINT "Operation_closedByAgentId_fkey";

-- AlterTable
ALTER TABLE "Operation" ALTER COLUMN "closedByAgentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_closedByAgentId_fkey" FOREIGN KEY ("closedByAgentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
