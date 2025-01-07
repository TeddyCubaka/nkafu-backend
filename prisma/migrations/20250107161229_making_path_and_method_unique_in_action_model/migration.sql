/*
  Warnings:

  - A unique constraint covering the columns `[path,method]` on the table `Action` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Action_path_method_key" ON "Action"("path", "method");
