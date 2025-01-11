-- CreateEnum
CREATE TYPE "OperationAction" AS ENUM ('TAXATION', 'LIQUIDATION');

-- AlterTable
ALTER TABLE "Operation" ADD COLUMN     "action" "OperationAction";
