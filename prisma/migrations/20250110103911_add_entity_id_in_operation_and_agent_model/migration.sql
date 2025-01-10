-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "entityId" TEXT;

-- AlterTable
ALTER TABLE "Operation" ADD COLUMN     "entityId" TEXT;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
