/*
  Warnings:

  - A unique constraint covering the columns `[dossierNumber]` on the table `Dossier` will be added. If there are existing duplicate values, this will fail.

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
ALTER TABLE `dossier` ADD COLUMN `dossierNumber` INTEGER NULL,
    ADD COLUMN `inQueue` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `Dossier_dossierNumber_key` ON `Dossier`(`dossierNumber`);

-- AddForeignKey
ALTER TABLE `AccessToken` ADD CONSTRAINT `AccessToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attachment` ADD CONSTRAINT `Attachment_dossierId_fkey` FOREIGN KEY (`dossierId`) REFERENCES `Dossier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dossier` ADD CONSTRAINT `Dossier_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reception` ADD CONSTRAINT `Reception_dossierId_fkey` FOREIGN KEY (`dossierId`) REFERENCES `Dossier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
