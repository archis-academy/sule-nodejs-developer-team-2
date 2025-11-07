/*
  Warnings:

  - Made the column `expense_category_id` on table `expenses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `teams` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."expenses" DROP CONSTRAINT "expenses_expense_category_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."teams" DROP CONSTRAINT "teams_created_by_fkey";

-- AlterTable
ALTER TABLE "expenses" ALTER COLUMN "expense_category_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "teams" ALTER COLUMN "created_by" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_expense_category_id_fkey" FOREIGN KEY ("expense_category_id") REFERENCES "expense_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
