-- DropForeignKey
ALTER TABLE "Operation" DROP CONSTRAINT "Operation_possessionId_fkey";

-- DropForeignKey
ALTER TABLE "Operation" DROP CONSTRAINT "Operation_recipeId_fkey";

-- AlterTable
ALTER TABLE "Operation" ALTER COLUMN "recipeId" DROP NOT NULL,
ALTER COLUMN "possessionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_possessionId_fkey" FOREIGN KEY ("possessionId") REFERENCES "Possession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
