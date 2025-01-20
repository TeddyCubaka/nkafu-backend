/*
  Warnings:

  - A unique constraint covering the columns `[deviceInnerId]` on the table `UserDevice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deviceInnerId` to the `UserDevice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserDevice" ADD COLUMN     "deviceInnerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserDevice_deviceInnerId_key" ON "UserDevice"("deviceInnerId");
