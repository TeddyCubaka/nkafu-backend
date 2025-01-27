-- AlterTable
ALTER TABLE "UserDevice" ADD COLUMN     "createdByUserId" TEXT,
ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false,
ADD COLUMN     "meta" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedByUserId" TEXT;
