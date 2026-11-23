-- ========================================================
-- Migration: Drop Obsolete Table `principals`
-- Glotra Helpdesk Ticketing System
-- Description:
-- Drops the obsolete master table `principals`.
-- Vendor/Principal information is now stored as free-form
-- text on ticket hold / escalation milestones.
-- ========================================================

DROP TABLE IF EXISTS `principals`;
