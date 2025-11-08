/*
  Warnings:

  - A unique constraint covering the columns `[teamId,name]` on the table `expense_categories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teamId` to the `expense_categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "expense_categories" ADD COLUMN     "teamId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "expense_categories_teamId_name_key" ON "expense_categories"("teamId", "name");

-- AddForeignKey
ALTER TABLE "expense_categories" ADD CONSTRAINT "expense_categories_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
