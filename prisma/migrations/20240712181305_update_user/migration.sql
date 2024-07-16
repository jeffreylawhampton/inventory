/*
  Warnings:

  - You are about to drop the column `userId` on the `Image` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_userId_fkey";

-- DropIndex
DROP INDEX "Category_name_key";

-- DropIndex
DROP INDEX "Location_name_key";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "userId",
ADD COLUMN     "alt" TEXT,
ADD COLUMN     "filename" TEXT,
ADD COLUMN     "mimetype" TEXT,
ADD COLUMN     "originalFileId" INTEGER,
ADD COLUMN     "originalPath" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "uploadId" TEXT,
ALTER COLUMN "url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email_verified" BOOLEAN,
ADD COLUMN     "family_name" TEXT,
ADD COLUMN     "given_name" TEXT,
ADD COLUMN     "nickname" TEXT,
ADD COLUMN     "picture" TEXT,
ADD COLUMN     "sid" TEXT,
ADD COLUMN     "sub" TEXT;

-- CreateTable
CREATE TABLE "OriginalFile" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "type" TEXT,
    "size" INTEGER,

    CONSTRAINT "OriginalFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_originalFileId_fkey" FOREIGN KEY ("originalFileId") REFERENCES "OriginalFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
