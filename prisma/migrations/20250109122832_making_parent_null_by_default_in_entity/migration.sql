-- DropForeignKey
ALTER TABLE "Entity" DROP CONSTRAINT "Entity_parentId_fkey";

-- AlterTable
ALTER TABLE "Entity" ALTER COLUMN "parentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
