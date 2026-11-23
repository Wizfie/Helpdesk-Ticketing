-- ========================================================
-- Migration: Normalize `ticket_milestones` Table
-- Glotra Helpdesk Ticketing System
-- Description:
-- Drops redundant denormalized columns `actorName` and `actorRole`.
-- Actor identity is now dynamically retrieved via foreign key
-- `actorId` -> `users.id`.
-- ========================================================

ALTER TABLE `ticket_milestones` 
  DROP COLUMN `actorName`,
  DROP COLUMN `actorRole`;
