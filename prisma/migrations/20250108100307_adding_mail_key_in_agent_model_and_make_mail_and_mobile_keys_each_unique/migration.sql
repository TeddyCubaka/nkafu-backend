/*
  Warnings:

  - A unique constraint covering the columns `[mobile]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mail]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "mail" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Agent_mobile_key" ON "Agent"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_mail_key" ON "Agent"("mail");
