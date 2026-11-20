-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.4.3 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- Generator:                    PT Glotra Helpdesk System Export
-- Target Database:              db_helpdesk_glotra
-- Generated At:                 2026-11-20T14:27:34.014Z
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS `db_helpdesk_glotra` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `db_helpdesk_glotra`;

-- Dumping structure for table db_helpdesk_glotra.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ENGINEER',
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '$2a$10$defaultPlaceholderHash2026',
  `phone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_helpdesk_glotra.users: 2 rows
DELETE FROM `users`;
INSERT INTO `users` (`id`, `name`, `email`, `role`, `password`, `phone`, `isActive`, `createdAt`, `updatedAt`) VALUES
	(1, 'Ahmad Fauzi', 'admin@glotratech.com', 'ADMIN', '$2a$10$defaultPlaceholderHash2026', '0811-9988-771', 1, '2026-09-30 15:18:07.784', '2026-11-16 15:39:10.971'),
	(10, 'Farhan Pratama', 'farhan.eng@glotratech.com', 'ENGINEER', '$2a$10$defaultPlaceholderHash2026', '0812-9999-8888', 1, '2026-11-19 15:27:06.033', '2026-11-19 15:35:46.362');

-- Dumping structure for table db_helpdesk_glotra.customers
DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `industry` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `maintenanceEnd` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `maintenanceStart` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slaTier` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '8x5 GOLD ENTERPRISE',
  `ticketQuota` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Unlimited',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_helpdesk_glotra.customers: 3 rows
DELETE FROM `customers`;
INSERT INTO `customers` (`id`, `name`, `industry`, `address`, `isActive`, `createdAt`, `updatedAt`, `maintenanceEnd`, `maintenanceStart`, `slaTier`, `ticketQuota`) VALUES
	(19, 'TELKOM', 'Telekomunikasi', 'Cluster asteria panongan blok e/38 kab. Tangerang cc', 1, '2026-11-19 11:53:09.767', '2026-11-19 11:55:13.530', '2027-11-19', '2026-11-19', 'GOLD', '100'),
	(20, 'PT Bank Central Asia Tbk', 'Perbankan & Finansial', 'Menara BCA Lt. 22, Grand Indonesia, Jl. M.H. Thamrin No. 1, Jakarta Pusat 10310', 1, '2026-11-19 16:19:10.490', '2026-11-19 16:22:02.298', '2027-10-31', '2026-11-01', 'PLATINUM', 'Unlimited'),
	(21, 'PT Kereta Api Indonesia (Persero)', 'Transportasi & Logistik', 'Kantor Pusat KAI, Jl. Perintis Kemerdekaan No. 1, Babakan Ciamis, Bandung 40117', 1, '2026-11-19 16:19:10.513', '2026-11-19 16:22:02.323', '2027-11-14', '2026-11-15', 'SILVER', '150');

-- Dumping structure for table db_helpdesk_glotra.customer_pics
DROP TABLE IF EXISTS `customer_pics`;
CREATE TABLE `customer_pics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customerId` int NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `customer_pics_customerId_fkey` (`customerId`),
  CONSTRAINT `customer_pics_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=512 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_helpdesk_glotra.customer_pics: 4 rows
DELETE FROM `customer_pics`;
INSERT INTO `customer_pics` (`id`, `customerId`, `name`, `phone`, `email`, `createdAt`, `updatedAt`) VALUES
	(505, 19, 'NANA', '0831231231', 'nana@mail.com', '2026-11-19 11:53:09.767', '2026-11-19 11:53:09.767'),
	(506, 20, 'Hendra Setiawan', '0812-8899-7711', 'hendra.setiawan@bca.co.id', '2026-11-19 16:19:10.490', '2026-11-19 16:19:10.490'),
	(507, 21, 'Dewi Anggraini', '0813-2233-4455', 'dewi.anggraini@kai.id', '2026-11-19 16:19:10.513', '2026-11-19 16:19:10.513'),
	(508, 19, 'Fransiska Merita Febryanti Putri', '085155221881', 'Wiz.fie@gmail.com', '2026-11-19 16:31:15.830', '2026-11-19 16:31:15.830');

-- Dumping structure for table db_helpdesk_glotra.kb_options
DROP TABLE IF EXISTS `kb_options`;
CREATE TABLE `kb_options` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `kb_options_type_name_key` (`type`,`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_helpdesk_glotra.kb_options: 0 rows
DELETE FROM `kb_options`;

-- Dumping structure for table db_helpdesk_glotra.principals
DROP TABLE IF EXISTS `principals`;
CREATE TABLE `principals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `specialist` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `supportEmail` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `supportPhone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `portalUrl` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `principals_name_key` (`name`),
  UNIQUE KEY `principals_code_key` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_helpdesk_glotra.principals: 0 rows
DELETE FROM `principals`;

-- Dumping structure for table db_helpdesk_glotra.sla_policies
DROP TABLE IF EXISTS `sla_policies`;
CREATE TABLE `sla_policies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tierName` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `operatingHours` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `p1ResponseHours` double NOT NULL,
  `p1ResolutionHours` double NOT NULL,
  `p2ResponseHours` double NOT NULL,
  `p2ResolutionHours` double NOT NULL,
  `p3ResponseHours` double NOT NULL,
  `p3ResolutionHours` double NOT NULL,
  `p4ResponseHours` double NOT NULL,
  `p4ResolutionHours` double NOT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `sla_policies_tierName_key` (`tierName`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_helpdesk_glotra.sla_policies: 3 rows
DELETE FROM `sla_policies`;
INSERT INTO `sla_policies` (`id`, `tierName`, `operatingHours`, `p1ResponseHours`, `p1ResolutionHours`, `p2ResponseHours`, `p2ResolutionHours`, `p3ResponseHours`, `p3ResolutionHours`, `p4ResponseHours`, `p4ResolutionHours`, `notes`, `createdAt`, `updatedAt`, `isActive`) VALUES
	(12, 'GOLD', '24 Jam x 7 Hari (Non-Stop)', 0.5, 4, 1, 8, 2, 24, 4, 48, '{"description":"test gold","status":"Active","createdBy":"Ahmad Fauzi"}', '2026-11-19 14:46:14.405', '2026-11-19 14:46:14.405', 1),
	(13, 'PLATINUM', '24 Jam x 7 Hari (Non-Stop)', 0.25, 2, 0.5, 4, 1, 8, 2, 24, '{"description":"SLA Premium Platinum 24x7 untuk infrastruktur mission critical perbankan & sistem inti","status":"Active","createdBy":"Administrator"}', '2026-11-19 16:22:02.260', '2026-11-19 16:22:02.260', 1),
	(14, 'SILVER', 'Senin - Jumat (08:00 - 17:00 WIB)', 1, 8, 2, 16, 4, 48, 8, 72, '{"description":"SLA Standar jam kerja operasional 8x5 untuk kebutuhan layanan bisnis reguler","status":"Active","createdBy":"Administrator"}', '2026-11-19 16:22:02.280', '2026-11-19 16:22:02.280', 1);

-- Dumping structure for table db_helpdesk_glotra.tickets
DROP TABLE IF EXISTS `tickets`;
CREATE TABLE `tickets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ticketNumber` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `customerId` int NOT NULL,
  `customerPicId` int DEFAULT NULL,
  `categoryId` int DEFAULT NULL,
  `severity` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MEDIUM',
  `channel` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EMAIL',
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rawMessage` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'OPEN',
  `trackingToken` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdById` int NOT NULL,
  `assignedToId` int DEFAULT NULL,
  `contractTier` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '8x5 GOLD ENTERPRISE',
  `cluster` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'PROD-CL01',
  `environment` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'PROD-DC-01',
  `impactScope` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Standard Operational',
  `isEmailSync` tinyint(1) NOT NULL DEFAULT '1',
  `isProposeKb` tinyint(1) NOT NULL DEFAULT '0',
  `escalationTier` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'INTERNAL',
  `principalVendor` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `principalCaseId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `principalSpecialist` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `principalBridgeStatus` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `principalLatestUpdate` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `principalUpdateTimestamp` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `partnerName` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `partnerPic` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `projectManager` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `responseDeadline` datetime(3) NOT NULL,
  `resolutionDeadline` datetime(3) NOT NULL,
  `respondedAt` datetime(3) DEFAULT NULL,
  `resolvedAt` datetime(3) DEFAULT NULL,
  `closedAt` datetime(3) DEFAULT NULL,
  `isPaused` tinyint(1) NOT NULL DEFAULT '0',
  `pausedAt` datetime(3) DEFAULT NULL,
  `totalPausedDurationSec` int NOT NULL DEFAULT '0',
  `isSlaResponseBreached` tinyint(1) NOT NULL DEFAULT '0',
  `isSlaResolutionBreached` tinyint(1) NOT NULL DEFAULT '0',
  `rootCause` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `resolutionStrategy` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `actionTaken` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `resolutionNotes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `recommendation` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tickets_ticketNumber_key` (`ticketNumber`),
  UNIQUE KEY `tickets_trackingToken_key` (`trackingToken`),
  KEY `tickets_customerId_fkey` (`customerId`),
  KEY `tickets_customerPicId_fkey` (`customerPicId`),
  KEY `tickets_categoryId_fkey` (`categoryId`),
  KEY `tickets_createdById_fkey` (`createdById`),
  KEY `tickets_assignedToId_fkey` (`assignedToId`),
  CONSTRAINT `tickets_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `tickets_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `kb_options` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `tickets_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `tickets_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `tickets_customerPicId_fkey` FOREIGN KEY (`customerPicId`) REFERENCES `customer_pics` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_helpdesk_glotra.tickets: 0 rows
DELETE FROM `tickets`;

-- Dumping structure for table db_helpdesk_glotra.ticket_milestones
DROP TABLE IF EXISTS `ticket_milestones`;
CREATE TABLE `ticket_milestones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ticketId` int NOT NULL,
  `stepName` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `actorId` int DEFAULT NULL,
  `actorName` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `actorRole` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `proofFile` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timestampUtc` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `ticket_milestones_ticketId_fkey` (`ticketId`),
  KEY `ticket_milestones_actorId_fkey` (`actorId`),
  CONSTRAINT `ticket_milestones_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ticket_milestones_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2666 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_helpdesk_glotra.ticket_milestones: 0 rows
DELETE FROM `ticket_milestones`;

-- Dumping structure for table db_helpdesk_glotra.knowledge_base
DROP TABLE IF EXISTS `knowledge_base`;
CREATE TABLE `knowledge_base` (
  `id` int NOT NULL AUTO_INCREMENT,
  `kbCode` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `caseType` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoryGroup` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `technologyPrincipal` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `author` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `approver` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PUBLISHED',
  `ticketsReferencedCount` int NOT NULL DEFAULT '0',
  `sourceTicket` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `symptom` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `rootCause` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `prerequisites` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cliSnippet` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `verificationSteps` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `rollbackProcedure` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `recommendation` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `pdfAttachmentUrl` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `documentName` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `documentSize` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `knowledge_base_kbCode_key` (`kbCode`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_helpdesk_glotra.knowledge_base: 1 rows
DELETE FROM `knowledge_base`;
INSERT INTO `knowledge_base` (`id`, `kbCode`, `title`, `caseType`, `category`, `categoryGroup`, `product`, `technologyPrincipal`, `author`, `approver`, `status`, `ticketsReferencedCount`, `sourceTicket`, `symptom`, `rootCause`, `prerequisites`, `cliSnippet`, `verificationSteps`, `rollbackProcedure`, `recommendation`, `pdfAttachmentUrl`, `documentName`, `documentSize`, `createdAt`, `updatedAt`) VALUES
	(39, 'KB-1001', 'SOP Failover & Recovery SAN Storage HPE 3PAR', 'Incident', 'SAN & Enterprise Storage', 'SAN & Enterprise Storage', 'HPE 3PAR / Primera', 'HPE 3PAR / Primera', 'Ahmad Fauzi', 'Ahmad Fauzi (Verified)', 'PUBLISHED', 0, NULL, '', '', NULL, NULL, NULL, NULL, NULL, '/uploads/SOP_Failover_HPE_3PAR-1795132552672-35526.docx', 'SOP_Failover_HPE_3PAR.docx', '1 KB', '2026-11-19 23:55:52.688', '2026-11-19 23:55:52.688');

-- Dumping structure for table db_helpdesk_glotra.audit_logs
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userName` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `entityType` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entityId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ipAddress` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '127.0.0.1',
  `timestampUtc` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_helpdesk_glotra.audit_logs: 21 rows
DELETE FROM `audit_logs`;
INSERT INTO `audit_logs` (`id`, `userName`, `role`, `action`, `entityType`, `entityId`, `description`, `ipAddress`, `timestampUtc`) VALUES
	(85, 'Rina Anggraini', 'ADMIN', 'SLA_POLICY_CREATED', 'SLA_POLICY', 'GOLD', 'Menambahkan kebijakan SLA baru: GOLD (GOLD)', '::1', '2026-11-17 18:40:09.305'),
	(86, 'Ahmad Fauzi', 'ADMIN', 'CUSTOMER_CREATED', 'CUSTOMER', 'TELK', 'Mendaftarkan klien mitra baru: TELKOM (TELK)', '::1', '2026-11-19 11:53:09.785'),
	(87, 'Ahmad Fauzi', 'ADMIN', 'CUSTOMER_UPDATED', 'CUSTOMER', 'TELK', 'Memperbarui profil mitra korporat: TELKOM', '::1', '2026-11-19 11:55:13.560'),
	(88, 'Ahmad Fauzi', 'ADMIN', 'SLA_POLICY_CREATED', 'SLA_POLICY', '12', 'Menambahkan kebijakan SLA baru: GOLD', '::1', '2026-11-19 14:46:14.425'),
	(89, 'Ahmad Fauzi', 'ADMIN', 'USER_CREATED', 'USER', 'USER-0010', 'Mendaftarkan staf baru: Farhan Pratama (Peran: Support Engineer)', '::1', '2026-11-19 15:27:06.205'),
	(90, 'Ahmad Fauzi', 'ADMIN', 'USER_UPDATED', 'USER', 'USER-0010', 'Memperbarui data profil staf Farhan Pratama', '::1', '2026-11-19 15:27:31.510'),
	(91, 'Ahmad Fauzi', 'ADMIN', 'USER_UPDATED', 'USER', 'USER-0010', 'Memperbarui data profil staf Farhan Pratama', '::1', '2026-11-19 15:35:40.887'),
	(92, 'Ahmad Fauzi', 'ADMIN', 'USER_UPDATED', 'USER', 'USER-0010', 'Memperbarui data profil staf Farhan Pratama', '::1', '2026-11-19 15:35:43.820'),
	(93, 'Ahmad Fauzi', 'ADMIN', 'USER_UPDATED', 'USER', 'USER-0010', 'Memperbarui data profil staf Farhan Pratama', '::1', '2026-11-19 15:35:45.731'),
	(94, 'Ahmad Fauzi', 'ADMIN', 'USER_UPDATED', 'USER', 'USER-0010', 'Memperbarui data profil staf Farhan Pratama', '::1', '2026-11-19 15:35:46.377'),
	(95, 'Ahmad Fauzi', 'ADMIN', 'USER_CREATED', 'USER', 'USER-0011', 'Mendaftarkan staf baru: Rian Hidayat (Peran: ENGINEER)', '::1', '2026-11-19 15:47:58.141'),
	(96, 'Ahmad Fauzi', 'ADMIN', 'USER_UPDATED', 'USER', 'USER-0011', 'Memperbarui data profil staf Rian Hidayat', '::1', '2026-11-19 15:48:17.617'),
	(97, 'Ahmad Fauzi', 'ADMIN', 'CUSTOMER_PIC_ADDED', 'CUSTOMER', '19', 'Menambahkan kontak PIC baru Fransiska Merita Febryanti Putri untuk mitra TELKOM', '::1', '2026-11-19 16:31:15.869'),
	(98, 'Ahmad Fauzi', 'ADMIN', 'CUSTOMER_PIC_ADDED', 'CUSTOMER', '20', 'Menambahkan kontak PIC baru Wizfie _ untuk mitra PT Bank Central Asia Tbk', '::1', '2026-11-19 16:33:27.174'),
	(99, 'Ahmad Fauzi', 'ADMIN', 'CUSTOMER_PIC_DELETED', 'CUSTOMER', '20', 'Menghapus kontak PIC: Wizfie _', '::1', '2026-11-19 16:38:58.540'),
	(100, 'Ahmad Fauzi', 'ADMIN', 'CUSTOMER_PIC_ADDED', 'CUSTOMER', '20', 'Menambahkan kontak PIC baru Wisfie Syahbani untuk mitra PT Bank Central Asia Tbk', '::1', '2026-11-19 16:39:09.786'),
	(101, 'Ahmad Fauzi', 'ADMIN', 'CUSTOMER_PIC_DELETED', 'CUSTOMER', '20', 'Menghapus kontak PIC: Wisfie Syahbani', '::1', '2026-11-19 16:56:21.263'),
	(102, 'Ahmad Fauzi', 'ADMIN', 'CUSTOMER_PIC_ADDED', 'CUSTOMER', '21', 'Menambahkan kontak PIC baru Wisfie Syahbani untuk mitra PT Kereta Api Indonesia (Persero)', '::1', '2026-11-19 16:56:33.882'),
	(103, 'Ahmad Fauzi', 'ADMIN', 'CUSTOMER_PIC_DELETED', 'CUSTOMER', '21', 'Menghapus kontak PIC: Wisfie Syahbani', '::1', '2026-11-19 16:56:45.173'),
	(104, 'Ahmad Fauzi', 'ADMIN', 'LOGIN', 'USER', 'USER-001', 'Staf Ahmad Fauzi (ADMIN) berhasil masuk / beralih sesi ke sistem', '::ffff:127.0.0.1', '2026-11-19 23:55:52.631'),
	(105, 'Ahmad Fauzi', 'ENGINEER', 'KB_CREATED', 'KB', 'KB-1001', 'Menerbitkan dokumen runbook Knowledge Base baru: SOP Failover & Recovery SAN Storage HPE 3PAR (File: SOP_Failover_HPE_3PAR.docx)', '::ffff:127.0.0.1', '2026-11-19 23:55:52.694');

-- Dumping structure for table db_helpdesk_glotra._prisma_migrations
DROP TABLE IF EXISTS `_prisma_migrations`;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_helpdesk_glotra._prisma_migrations: 1 rows
DELETE FROM `_prisma_migrations`;
INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
	('b6df2529-aaab-4390-99ad-98f8e48dfbdd', 'd3b79f48ae10cea64fb0ec9385c812d320548fc4ffd0c420d2d345c926b46b5f', '2026-09-30 15:17:41.125', '20260930151731_init_helpdesk_glotrak', NULL, NULL, '2026-09-30 15:17:31.838', '1');

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
