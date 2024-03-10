-- DropIndex
DROP INDEX `AccessToken_userId_fkey` ON `accesstoken`;

-- DropIndex
DROP INDEX `Dossier_patientId_fkey` ON `dossier`;

-- DropIndex
DROP INDEX `DrugRecord_dossierId_fkey` ON `drugrecord`;

-- AddForeignKey
ALTER TABLE `AccessToken` ADD CONSTRAINT `AccessToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dossier` ADD CONSTRAINT `Dossier_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DrugRecord` ADD CONSTRAINT `DrugRecord_dossierId_fkey` FOREIGN KEY (`dossierId`) REFERENCES `Dossier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
