-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `roles_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roleId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL DEFAULT '$2a$10$defaultPlaceholderHash2026',
    `initials` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `roleTitle` VARCHAR(191) NULL,
    `shift` VARCHAR(191) NULL,
    `supervisor` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `industry` VARCHAR(191) NOT NULL,
    `serviceContract` VARCHAR(191) NOT NULL DEFAULT 'PKS Layanan Managed Service 24x7',
    `contractTier` VARCHAR(191) NOT NULL DEFAULT '8x5 GOLD ENTERPRISE',
    `address` TEXT NULL,
    `cluster` VARCHAR(191) NULL DEFAULT 'PROD-CL01',
    `environment` VARCHAR(191) NULL DEFAULT 'PROD-DC-01',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `customers_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer_pics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `dept` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `desc` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `categories_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sla_policies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tierCode` VARCHAR(191) NOT NULL,
    `tierName` VARCHAR(191) NOT NULL,
    `operatingHours` VARCHAR(191) NOT NULL,
    `p1ResponseHours` DOUBLE NOT NULL,
    `p1ResolutionHours` DOUBLE NOT NULL,
    `p2ResponseHours` DOUBLE NOT NULL,
    `p2ResolutionHours` DOUBLE NOT NULL,
    `p3ResponseHours` DOUBLE NOT NULL,
    `p3ResolutionHours` DOUBLE NOT NULL,
    `p4ResponseHours` DOUBLE NOT NULL,
    `p4ResolutionHours` DOUBLE NOT NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sla_policies_tierCode_key`(`tierCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tickets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticketNumber` VARCHAR(191) NOT NULL,
    `customerId` INTEGER NOT NULL,
    `customerPicId` INTEGER NULL,
    `categoryId` INTEGER NOT NULL,
    `severity` VARCHAR(191) NOT NULL DEFAULT 'MEDIUM',
    `channel` VARCHAR(191) NOT NULL DEFAULT 'EMAIL',
    `title` VARCHAR(191) NOT NULL,
    `rawMessage` TEXT NULL,
    `description` TEXT NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'OPEN',
    `trackingToken` VARCHAR(191) NOT NULL,
    `createdById` INTEGER NOT NULL,
    `assignedToId` INTEGER NULL,
    `contractSla` VARCHAR(191) NULL DEFAULT 'SLA-GOLD-2026',
    `contractTier` VARCHAR(191) NULL DEFAULT '8x5 GOLD ENTERPRISE',
    `cluster` VARCHAR(191) NULL DEFAULT 'PROD-CL01',
    `environment` VARCHAR(191) NULL DEFAULT 'PROD-DC-01',
    `impactScope` VARCHAR(191) NULL DEFAULT 'Standard Operational',
    `isEmailSync` BOOLEAN NOT NULL DEFAULT true,
    `isProposeKb` BOOLEAN NOT NULL DEFAULT false,
    `escalationTier` VARCHAR(191) NOT NULL DEFAULT 'INTERNAL',
    `principalVendor` VARCHAR(191) NULL,
    `principalCaseId` VARCHAR(191) NULL,
    `principalSpecialist` VARCHAR(191) NULL,
    `principalBridgeStatus` VARCHAR(191) NULL,
    `principalLatestUpdate` TEXT NULL,
    `principalUpdateTimestamp` VARCHAR(191) NULL,
    `partnerName` VARCHAR(191) NULL,
    `partnerPic` VARCHAR(191) NULL,
    `projectManager` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `responseDeadline` DATETIME(3) NOT NULL,
    `resolutionDeadline` DATETIME(3) NOT NULL,
    `respondedAt` DATETIME(3) NULL,
    `resolvedAt` DATETIME(3) NULL,
    `closedAt` DATETIME(3) NULL,
    `isPaused` BOOLEAN NOT NULL DEFAULT false,
    `pausedAt` DATETIME(3) NULL,
    `totalPausedDurationSec` INTEGER NOT NULL DEFAULT 0,
    `isSlaResponseBreached` BOOLEAN NOT NULL DEFAULT false,
    `isSlaResolutionBreached` BOOLEAN NOT NULL DEFAULT false,
    `rootCause` TEXT NULL,
    `resolutionStrategy` TEXT NULL,
    `actionTaken` TEXT NULL,
    `resolutionNotes` TEXT NULL,
    `recommendation` TEXT NULL,

    UNIQUE INDEX `tickets_ticketNumber_key`(`ticketNumber`),
    UNIQUE INDEX `tickets_trackingToken_key`(`trackingToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sla_hold_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticketId` INTEGER NOT NULL,
    `reasonType` VARCHAR(191) NOT NULL,
    `reasonDetail` TEXT NOT NULL,
    `principalCaseId` VARCHAR(191) NULL,
    `pausedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `resumedAt` DATETIME(3) NULL,
    `durationSec` INTEGER NOT NULL DEFAULT 0,
    `actorName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticket_milestones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticketId` INTEGER NOT NULL,
    `stepName` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `actorId` INTEGER NULL,
    `actorName` VARCHAR(191) NOT NULL,
    `actorRole` VARCHAR(191) NOT NULL,
    `notes` TEXT NOT NULL,
    `proofFile` VARCHAR(191) NULL,
    `timestampUtc` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attachments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticketId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(191) NOT NULL,
    `filePath` VARCHAR(191) NULL,
    `fileType` VARCHAR(191) NOT NULL,
    `size` VARCHAR(191) NOT NULL,
    `uploadedBy` VARCHAR(191) NOT NULL,
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `source` VARCHAR(191) NOT NULL DEFAULT 'Milestone Upload',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `knowledge_base` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kbCode` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `categoryGroup` VARCHAR(191) NULL,
    `technologyPrincipal` VARCHAR(191) NULL,
    `author` VARCHAR(191) NOT NULL,
    `approver` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PUBLISHED',
    `ticketsReferencedCount` INTEGER NOT NULL DEFAULT 0,
    `sourceTicket` VARCHAR(191) NULL,
    `symptom` TEXT NOT NULL,
    `rootCause` TEXT NOT NULL,
    `prerequisites` TEXT NULL,
    `cliSnippet` TEXT NULL,
    `verificationSteps` TEXT NULL,
    `rollbackProcedure` TEXT NULL,
    `recommendation` TEXT NULL,
    `pdfAttachmentUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `knowledge_base_kbCode_key`(`kbCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userName` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `entityType` VARCHAR(191) NULL,
    `entityId` VARCHAR(191) NULL,
    `description` TEXT NOT NULL,
    `ipAddress` VARCHAR(191) NOT NULL DEFAULT '127.0.0.1',
    `timestampUtc` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customer_pics` ADD CONSTRAINT `customer_pics_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_customerPicId_fkey` FOREIGN KEY (`customerPicId`) REFERENCES `customer_pics`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sla_hold_logs` ADD CONSTRAINT `sla_hold_logs_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `tickets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket_milestones` ADD CONSTRAINT `ticket_milestones_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `tickets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket_milestones` ADD CONSTRAINT `ticket_milestones_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attachments` ADD CONSTRAINT `attachments_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `tickets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
