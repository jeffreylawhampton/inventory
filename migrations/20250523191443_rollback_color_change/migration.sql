-- DropForeignKey
ALTER TABLE "Container" DROP CONSTRAINT "Container_colorId_fkey";

-- AlterTable
ALTER TABLE "Container" ALTER COLUMN "colorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Container" ADD CONSTRAINT "Container_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE SET NULL ON UPDATE CASCADE;
