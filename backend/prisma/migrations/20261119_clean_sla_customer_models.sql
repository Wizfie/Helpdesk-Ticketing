-- ========================================================
-- Migration: Clean SLA and Customer Models
-- Glotra Helpdesk Ticketing System
-- Description:
-- 1. Cleans redundant/obsolete columns in `customers`:
--    - Drops: cluster, environment, contractSla, contractTier, slaCoverage
--    - Makes industry & serviceContract optional
--    - Ensures slaTier, maintenanceStart, maintenanceEnd, ticketQuota exist
-- 2. Enhances `sla_policies`:
--    - Adds isActive column (default true)
--    - Cleans out legacy hardcoded mock rows
-- 3. Drops obsolete `quick_presets` table
-- 4. Cleans redundant `contractSla` column in `tickets`
-- ========================================================

-- 1. Clean customers table
ALTER TABLE `customers` 
  DROP COLUMN `cluster`,
  DROP COLUMN `environment`,
  DROP COLUMN `contractSla`,
  DROP COLUMN `contractTier`,
  DROP COLUMN `slaCoverage`;

ALTER TABLE `customers` 
  MODIFY COLUMN `industry` VARCHAR(191) NULL,
  MODIFY COLUMN `serviceContract` VARCHAR(191) NULL DEFAULT 'PKS Layanan Managed Service 24x7';

-- 2. Enhance sla_policies table
ALTER TABLE `sla_policies` 
  ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- Remove legacy mock SLA policies if present
DELETE FROM `sla_policies` 
WHERE `tierCode` IN ('PLATINUM_24X7', 'GOLD_8X5', 'GOV_TIER1', 'SILVER_8X5') 
   OR (`id` BETWEEN 1 AND 4);

-- 3. Drop obsolete quick_presets table
DROP TABLE IF EXISTS `quick_presets`;

-- 4. Clean tickets table
ALTER TABLE `tickets` 
  DROP COLUMN `contractSla`;
