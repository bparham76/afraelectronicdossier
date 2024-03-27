/*
  Warnings:

  - You are about to drop the column `storeState` on the `attachment` table. All the data in the column will be lost.
  - You are about to drop the column `storeState` on the `dossier` table. All the data in the column will be lost.
  - You are about to drop the column `storeState` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `storeState` on the `reception` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `AccessToken_userId_fkey` ON `accesstoken`;

-- DropIndex
DROP INDEX `Attachment_dossierId_fkey` ON `attachment`;

-- DropIndex
DROP INDEX `Dossier_patientId_fkey` ON `dossier`;

-- DropIndex
DROP INDEX `Reception_dossierId_fkey` ON `reception`;

-- AlterTable
ALTER TABLE `attachment` DROP COLUMN `storeState`;

-- AlterTable
ALTER TABLE `dossier` DROP COLUMN `storeState`;

-- AlterTable
ALTER TABLE `patient` DROP COLUMN `storeState`;

-- AlterTable
ALTER TABLE `reception` DROP COLUMN `storeState`;

-- AddForeignKey
ALTER TABLE `AccessToken` ADD CONSTRAINT `AccessToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attachment` ADD CONSTRAINT `Attachment_dossierId_fkey` FOREIGN KEY (`dossierId`) REFERENCES `Dossier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dossier` ADD CONSTRAINT `Dossier_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reception` ADD CONSTRAINT `Reception_dossierId_fkey` FOREIGN KEY (`dossierId`) REFERENCES `Dossier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
