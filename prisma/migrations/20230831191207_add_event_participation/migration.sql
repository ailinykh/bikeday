-- CreateTable
CREATE TABLE `EventParticipation` (
    `eventId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `bike` VARCHAR(191) NOT NULL,
    `band` VARCHAR(191) NULL,
    `bandBy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `EventParticipation_eventId_userId_key`(`eventId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EventParticipation` ADD CONSTRAINT `EventParticipation_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventParticipation` ADD CONSTRAINT `EventParticipation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
