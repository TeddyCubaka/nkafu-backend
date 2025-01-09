/*
  Warnings:

  - You are about to drop the column `createBy` on the `rfActivitySectors` table. All the data in the column will be lost.
  - You are about to drop the column `updateBy` on the `rfActivitySectors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "rfActivitySectors" DROP COLUMN "createBy",
DROP COLUMN "updateBy",
ADD COLUMN     "createdByUserId" TEXT,
ADD COLUMN     "updatedByUserId" TEXT,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "isDeleted" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "rfActivitySectors" ADD CONSTRAINT "rfActivitySectors_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfActivitySectors" ADD CONSTRAINT "rfActivitySectors_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
