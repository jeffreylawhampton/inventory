/*
  Warnings:

  - Made the column `colorId` on table `Container` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Container" DROP CONSTRAINT "Container_colorId_fkey";

-- AlterTable
ALTER TABLE "Container" ALTER COLUMN "colorId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Container" ADD CONSTRAINT "Container_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
