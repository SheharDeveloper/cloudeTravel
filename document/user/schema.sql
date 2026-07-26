-- ============================================================
-- Database Schema: Multi-Tenant Role-Based Agency Management System
-- Tenancy Model : Single database, shared tables
-- Auth Model    : THREE separate tables, each its own Laravel guard
--                 - admins        (guard: admin)   -> Super Admin, Super Admin Staff
--                 - agency_users  (guard: agency)  -> Agency, Agency Staff
--                 - clients       (guard: client)  -> Agency Client
-- Tenant Key    : `tenant_id` on main tables (tenants, agency_users, clients, domains)
-- Tenant Ident. : Subdomain OR verified custom domain (see `domains`)
-- Permission Layer: Spatie laravel-permission (multi-guard)
--
-- REQUIRES: MySQL 8.0.13+ or MariaDB 10.2.3+
--   (needed for `DEFAULT (UUID())` expression defaults on CHAR columns)
--
-- UUID COLUMNS: every table has BOTH:
--   - `id`   BIGINT auto-increment  -> internal PK, used for joins/FKs (fast)
--   - `uuid` CHAR(36)               -> public-safe identifier for URLs/APIs
-- ============================================================

-- ============================================================
-- 1. TENANT REGISTRY (source of truth for tenancy)
-- ============================================================

CREATE TABLE `tenants` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL DEFAULT (UUID()),
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(150) NOT NULL,
  `plan` VARCHAR(50) NULL,
  `status` ENUM('active','inactive','suspended') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tenants_uuid_unique` (`uuid`),
  UNIQUE KEY `tenants_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 2. AUTH TABLES — one per guard, platform-level first
-- ============================================================

-- GUARD: admin — platform-level, NOT tied to any tenant
CREATE TABLE `admins` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL DEFAULT (UUID()),
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `admin_role` ENUM('super_admin','super_admin_staff') NOT NULL,
  `created_by` BIGINT UNSIGNED NULL,        -- self-reference: which admin created this one (NULL for the first super_admin)
  `status` ENUM('active','inactive','suspended') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admins_uuid_unique` (`uuid`),
  UNIQUE KEY `admins_email_unique` (`email`),
  CONSTRAINT `admins_created_by_foreign`
    FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- GUARD: agency — tenant-level, back-office login (Agency owner + Agency Staff)
CREATE TABLE `agency_users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL DEFAULT (UUID()),
  `tenant_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `agency_role` ENUM('agency','agency_staff') NOT NULL,  -- 'agency' = the tenant owner account
  -- Polymorphic creator: an Agency owner is created by an Admin;
  -- an Agency Staff member is created by the Agency owner (another agency_user).
  `created_by_type` ENUM('admin','agency_user') NOT NULL,
  `created_by_id` BIGINT UNSIGNED NOT NULL,   -- points to admins.id or agency_users.id depending on created_by_type
  `status` ENUM('active','inactive','suspended') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `agency_users_uuid_unique` (`uuid`),
  UNIQUE KEY `agency_users_tenant_email_unique` (`tenant_id`, `email`), -- email unique per tenant
  KEY `agency_users_tenant_id_index` (`tenant_id`),
  KEY `agency_users_created_by_index` (`created_by_type`, `created_by_id`),
  CONSTRAINT `agency_users_tenant_id_foreign`
    FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- GUARD: client — tenant-level, customer portal login (Agency Client)
CREATE TABLE `clients` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL DEFAULT (UUID()),
  `tenant_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_by` BIGINT UNSIGNED NOT NULL,     -- FK -> agency_users.id (only Agency/Agency Staff create clients)
  `status` ENUM('active','inactive','suspended') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clients_uuid_unique` (`uuid`),
  UNIQUE KEY `clients_tenant_email_unique` (`tenant_id`, `email`),
  KEY `clients_tenant_id_index` (`tenant_id`),
  CONSTRAINT `clients_tenant_id_foreign`
    FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `clients_created_by_foreign`
    FOREIGN KEY (`created_by`) REFERENCES `agency_users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 3. AGENCY (business entity, 1-to-1 with tenant, owned by an agency_user)
-- ============================================================

CREATE TABLE `agencies` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL DEFAULT (UUID()),
  `tenant_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `owner_agency_user_id` BIGINT UNSIGNED NOT NULL,  -- FK -> agency_users.id (the 'agency' role account)
  `created_by_admin_id` BIGINT UNSIGNED NOT NULL,   -- FK -> admins.id (who created this agency)
  `status` ENUM('active','inactive','suspended') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `agencies_uuid_unique` (`uuid`),
  UNIQUE KEY `agencies_tenant_id_unique` (`tenant_id`),
  UNIQUE KEY `agencies_owner_agency_user_id_unique` (`owner_agency_user_id`),
  CONSTRAINT `agencies_tenant_id_foreign`
    FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `agencies_owner_agency_user_id_foreign`
    FOREIGN KEY (`owner_agency_user_id`) REFERENCES `agency_users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `agencies_created_by_admin_id_foreign`
    FOREIGN KEY (`created_by_admin_id`) REFERENCES `admins` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 4. DOMAIN MAPPING (tenant identification: subdomain + custom domain)
-- ============================================================

CREATE TABLE `domains` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL DEFAULT (UUID()),
  `tenant_id` BIGINT UNSIGNED NOT NULL,
  `domain` VARCHAR(255) NOT NULL,
  `type` ENUM('subdomain','custom') NOT NULL DEFAULT 'subdomain',
  `is_primary` BOOLEAN NOT NULL DEFAULT FALSE,
  `verified_at` TIMESTAMP NULL,
  `ssl_status` ENUM('pending','active','failed') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `domains_uuid_unique` (`uuid`),
  UNIQUE KEY `domains_domain_unique` (`domain`),
  KEY `domains_tenant_id_index` (`tenant_id`),
  CONSTRAINT `domains_tenant_id_foreign`
    FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 5. SPATIE PERMISSION TABLES (multi-guard)
-- roles/permissions.guard_name matches which auth table a role applies to:
--   guard_name = 'admin'  -> for the `admins` table
--   guard_name = 'agency' -> for the `agency_users` table
--   guard_name = 'client' -> for the `clients` table
-- model_has_roles / model_has_permissions use model_type (the PHP class,
-- e.g. App\Models\Admin / App\Models\AgencyUser / App\Models\Client) +
-- model_id, so all three guards safely share the same pivot tables.
-- ============================================================

CREATE TABLE `permissions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL DEFAULT (UUID()),
  `name` VARCHAR(125) NOT NULL,
  `guard_name` VARCHAR(125) NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_uuid_unique` (`uuid`),
  UNIQUE KEY `permissions_name_guard_unique` (`name`, `guard_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `roles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL DEFAULT (UUID()),
  `name` VARCHAR(125) NOT NULL,
  `guard_name` VARCHAR(125) NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_uuid_unique` (`uuid`),
  UNIQUE KEY `roles_name_guard_unique` (`name`, `guard_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `model_has_permissions` (
  `uuid` CHAR(36) NOT NULL DEFAULT (UUID()),
  `permission_id` BIGINT UNSIGNED NOT NULL,
  `model_type` VARCHAR(125) NOT NULL,   -- e.g. App\Models\Admin, App\Models\AgencyUser, App\Models\Client
  `model_id` BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (`permission_id`, `model_id`, `model_type`),
  UNIQUE KEY `model_has_permissions_uuid_unique` (`uuid`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`, `model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign`
    FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `model_has_roles` (
  `uuid` CHAR(36) NOT NULL DEFAULT (UUID()),
  `role_id` BIGINT UNSIGNED NOT NULL,
  `model_type` VARCHAR(125) NOT NULL,
  `model_id` BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (`role_id`, `model_id`, `model_type`),
  UNIQUE KEY `model_has_roles_uuid_unique` (`uuid`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`, `model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign`
    FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `role_has_permissions` (
  `uuid` CHAR(36) NOT NULL DEFAULT (UUID()),
  `permission_id` BIGINT UNSIGNED NOT NULL,
  `role_id` BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (`permission_id`, `role_id`),
  UNIQUE KEY `role_has_permissions_uuid_unique` (`uuid`),
  CONSTRAINT `role_has_permissions_permission_id_foreign`
    FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_has_permissions_role_id_foreign`
    FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 6. STAFF EXTENDED INFORMATION TABLES
-- Child tables of `agency_users` (covers 'agency' and 'agency_staff' roles).
-- No tenant_id here — derived via agency_user_id -> agency_users.tenant_id
-- ============================================================

CREATE TABLE `staff_profiles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL DEFAULT (UUID()),
  `agency_user_id` BIGINT UNSIGNED NOT NULL,
  `profile_photo` VARCHAR(255) NULL,
  `date_of_birth` DATE NULL,
  `gender` ENUM('male','female','other') NULL,
  `phone` VARCHAR(20) NULL,
  `emergency_contact_name` VARCHAR(255) NULL,
  `emergency_contact_phone` VARCHAR(20) NULL,
  `address_line1` VARCHAR(255) NULL,
  `address_line2` VARCHAR(255) NULL,
  `city` VARCHAR(100) NULL,
  `state` VARCHAR(100) NULL,
  `country` VARCHAR(100) NULL,
  `postal_code` VARCHAR(20) NULL,
  `designation` VARCHAR(150) NULL,
  `department` VARCHAR(150) NULL,
  `employment_type` ENUM('full_time','part_time','contract','intern') NULL,
  `joining_date` DATE NULL,
  `leaving_date` DATE NULL,
  `national_id_number` VARCHAR(100) NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `staff_profiles_uuid_unique` (`uuid`),
  UNIQUE KEY `staff_profiles_agency_user_id_unique` (`agency_user_id`),
  CONSTRAINT `staff_profiles_agency_user_id_foreign`
    FOREIGN KEY (`agency_user_id`) REFERENCES `agency_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `staff_pay_details` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL DEFAULT (UUID()),
  `agency_user_id` BIGINT UNSIGNED NOT NULL,
  `salary_amount` DECIMAL(12,2) NOT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
  `pay_frequency` ENUM('hourly','weekly','biweekly','monthly','annually') NOT NULL DEFAULT 'monthly',
  `payment_method` ENUM('bank_transfer','cheque','cash','other') NOT NULL DEFAULT 'bank_transfer',
  `effective_date` DATE NOT NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `staff_pay_details_uuid_unique` (`uuid`),
  KEY `staff_pay_details_agency_user_id_index` (`agency_user_id`),
  CONSTRAINT `staff_pay_details_agency_user_id_foreign`
    FOREIGN KEY (`agency_user_id`) REFERENCES `agency_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `staff_bank_details` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL DEFAULT (UUID()),
  `agency_user_id` BIGINT UNSIGNED NOT NULL,
  `bank_name` VARCHAR(150) NULL,
  `account_holder_name` VARCHAR(150) NULL,
  `account_number` VARCHAR(255) NULL,      -- store encrypted
  `iban` VARCHAR(255) NULL,                -- store encrypted
  `swift_bic_code` VARCHAR(50) NULL,
  `ifsc_code` VARCHAR(50) NULL,
  `branch_name` VARCHAR(150) NULL,
  `branch_address` VARCHAR(255) NULL,
  `tax_id_number` VARCHAR(100) NULL,
  `payment_email` VARCHAR(150) NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `staff_bank_details_uuid_unique` (`uuid`),
  UNIQUE KEY `staff_bank_details_agency_user_id_unique` (`agency_user_id`),
  CONSTRAINT `staff_bank_details_agency_user_id_foreign`
    FOREIGN KEY (`agency_user_id`) REFERENCES `agency_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `staff_education` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL DEFAULT (UUID()),
  `agency_user_id` BIGINT UNSIGNED NOT NULL,
  `degree_title` VARCHAR(150) NOT NULL,
  `field_of_study` VARCHAR(150) NULL,
  `institution_name` VARCHAR(255) NULL,
  `start_year` YEAR NULL,
  `end_year` YEAR NULL,
  `grade_or_gpa` VARCHAR(50) NULL,
  `certificate_file` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `staff_education_uuid_unique` (`uuid`),
  KEY `staff_education_agency_user_id_index` (`agency_user_id`),
  CONSTRAINT `staff_education_agency_user_id_foreign`
    FOREIGN KEY (`agency_user_id`) REFERENCES `agency_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Master skill list — global, not tenant- or user-table-scoped
CREATE TABLE `skills` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL DEFAULT (UUID()),
  `name` VARCHAR(150) NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `skills_uuid_unique` (`uuid`),
  UNIQUE KEY `skills_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `staff_skills` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL DEFAULT (UUID()),
  `agency_user_id` BIGINT UNSIGNED NOT NULL,
  `skill_id` BIGINT UNSIGNED NOT NULL,
  `proficiency` ENUM('beginner','intermediate','advanced','expert') NOT NULL DEFAULT 'intermediate',
  `years_experience` DECIMAL(4,1) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `staff_skills_agency_user_skill_unique` (`agency_user_id`, `skill_id`),
  CONSTRAINT `staff_skills_agency_user_id_foreign`
    FOREIGN KEY (`agency_user_id`) REFERENCES `agency_users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `staff_skills_skill_id_foreign`
    FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `staff_documents` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL DEFAULT (UUID()),
  `agency_user_id` BIGINT UNSIGNED NOT NULL,
  `document_type` ENUM('id_proof','resume','contract','certificate','offer_letter','other') NOT NULL,
  `document_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `uploaded_by_agency_user_id` BIGINT UNSIGNED NULL,
  `expiry_date` DATE NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `staff_documents_uuid_unique` (`uuid`),
  KEY `staff_documents_agency_user_id_index` (`agency_user_id`),
  CONSTRAINT `staff_documents_agency_user_id_foreign`
    FOREIGN KEY (`agency_user_id`) REFERENCES `agency_users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `staff_documents_uploaded_by_foreign`
    FOREIGN KEY (`uploaded_by_agency_user_id`) REFERENCES `agency_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 7. CLIENT EXTENDED INFORMATION TABLES
-- Child tables of `clients`. No tenant_id — derived via
-- client_id -> clients.tenant_id
-- ============================================================

CREATE TABLE `client_profiles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL DEFAULT (UUID()),
  `client_id` BIGINT UNSIGNED NOT NULL,
  `company_name` VARCHAR(255) NULL,
  `industry` VARCHAR(150) NULL,
  `contact_person_name` VARCHAR(255) NULL,
  `contact_person_title` VARCHAR(150) NULL,
  `phone` VARCHAR(20) NULL,
  `alternate_phone` VARCHAR(20) NULL,
  `address_line1` VARCHAR(255) NULL,
  `address_line2` VARCHAR(255) NULL,
  `city` VARCHAR(100) NULL,
  `state` VARCHAR(100) NULL,
  `country` VARCHAR(100) NULL,
  `postal_code` VARCHAR(20) NULL,
  `client_since` DATE NULL,
  `source` VARCHAR(150) NULL,
  `client_status` ENUM('lead','active','on_hold','churned') NOT NULL DEFAULT 'lead',
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `client_profiles_uuid_unique` (`uuid`),
  UNIQUE KEY `client_profiles_client_id_unique` (`client_id`),
  CONSTRAINT `client_profiles_client_id_foreign`
    FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Billing details deliberately left minimal for now — expand later.
CREATE TABLE `client_billing_details` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL DEFAULT (UUID()),
  `client_id` BIGINT UNSIGNED NOT NULL,
  `billing_name` VARCHAR(255) NULL,
  `billing_email` VARCHAR(150) NULL,
  `billing_address_line1` VARCHAR(255) NULL,
  `billing_address_line2` VARCHAR(255) NULL,
  `billing_city` VARCHAR(100) NULL,
  `billing_state` VARCHAR(100) NULL,
  `billing_country` VARCHAR(100) NULL,
  `billing_postal_code` VARCHAR(20) NULL,
  `tax_vat_number` VARCHAR(100) NULL,
  `payment_terms` ENUM('due_on_receipt','net_15','net_30','net_60') NOT NULL DEFAULT 'net_30',
  `preferred_currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
  `payment_method` ENUM('bank_transfer','credit_card','cheque','other') NULL,
  `card_last_four` VARCHAR(4) NULL,
  `payment_gateway_customer_id` VARCHAR(150) NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `client_billing_details_uuid_unique` (`uuid`),
  UNIQUE KEY `client_billing_details_client_id_unique` (`client_id`),
  CONSTRAINT `client_billing_details_client_id_foreign`
    FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `client_documents` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL DEFAULT (UUID()),
  `client_id` BIGINT UNSIGNED NOT NULL,
  `document_type` ENUM('contract','agreement','invoice','id_proof','other') NOT NULL,
  `document_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `uploaded_by_agency_user_id` BIGINT UNSIGNED NULL,
  `expiry_date` DATE NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `client_documents_uuid_unique` (`uuid`),
  KEY `client_documents_client_id_index` (`client_id`),
  CONSTRAINT `client_documents_client_id_foreign`
    FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `client_documents_uploaded_by_foreign`
    FOREIGN KEY (`uploaded_by_agency_user_id`) REFERENCES `agency_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `client_notes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL DEFAULT (UUID()),
  `client_id` BIGINT UNSIGNED NOT NULL,             -- which client this note is about
  `author_agency_user_id` BIGINT UNSIGNED NOT NULL, -- which staff member wrote it
  `note_type` ENUM('call','email','meeting','general') NOT NULL DEFAULT 'general',
  `note` TEXT NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `client_notes_uuid_unique` (`uuid`),
  KEY `client_notes_client_id_index` (`client_id`),
  CONSTRAINT `client_notes_client_id_foreign`
    FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `client_notes_author_agency_user_id_foreign`
    FOREIGN KEY (`author_agency_user_id`) REFERENCES `agency_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `client_staff_assignments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL DEFAULT (UUID()),
  `client_id` BIGINT UNSIGNED NOT NULL,
  `agency_user_id` BIGINT UNSIGNED NOT NULL,
  `role_in_assignment` VARCHAR(100) NULL,
  `assigned_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `client_staff_assignments_uuid_unique` (`uuid`),
  UNIQUE KEY `client_staff_assignments_unique` (`client_id`, `agency_user_id`),
  CONSTRAINT `client_staff_assignments_client_id_foreign`
    FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `client_staff_assignments_agency_user_id_foreign`
    FOREIGN KEY (`agency_user_id`) REFERENCES `agency_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 8. SUPPORTING TABLES
-- ============================================================

-- Audit log: actor can be an admin, agency_user, OR client (polymorphic)
CREATE TABLE `audit_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL DEFAULT (UUID()),
  `actor_type` ENUM('admin','agency_user','client') NOT NULL,
  `actor_id` BIGINT UNSIGNED NOT NULL,     -- points to admins.id / agency_users.id / clients.id depending on actor_type
  `action` VARCHAR(255) NOT NULL,
  `target_id` BIGINT UNSIGNED NULL,
  `target_type` VARCHAR(125) NULL,
  `created_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `audit_logs_uuid_unique` (`uuid`),
  KEY `audit_logs_actor_index` (`actor_type`, `actor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 9. SEED DATA: Roles & Permissions (multi-guard)
-- ============================================================

INSERT INTO `roles` (`name`, `guard_name`, `created_at`, `updated_at`) VALUES
('super_admin', 'admin', NOW(), NOW()),
('super_admin_staff', 'admin', NOW(), NOW()),
('agency', 'agency', NOW(), NOW()),
('agency_staff', 'agency', NOW(), NOW()),
('agency_client', 'client', NOW(), NOW());

INSERT INTO `permissions` (`name`, `guard_name`, `created_at`, `updated_at`) VALUES
('manage_agencies', 'admin', NOW(), NOW()),
('manage_super_admin_staff', 'admin', NOW(), NOW()),
('manage_staff', 'agency', NOW(), NOW()),
('manage_clients', 'agency', NOW(), NOW()),
('view_reports', 'agency', NOW(), NOW()),
('manage_billing', 'agency', NOW(), NOW());

-- super_admin -> all admin-guard permissions
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`)
SELECT p.`id`, (SELECT id FROM roles WHERE name = 'super_admin' AND guard_name = 'admin')
FROM `permissions` p WHERE p.guard_name = 'admin';

-- agency -> manage_staff, manage_clients (agency guard)
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
((SELECT id FROM permissions WHERE name = 'manage_staff' AND guard_name = 'agency'),
 (SELECT id FROM roles WHERE name = 'agency' AND guard_name = 'agency')),
((SELECT id FROM permissions WHERE name = 'manage_clients' AND guard_name = 'agency'),
 (SELECT id FROM roles WHERE name = 'agency' AND guard_name = 'agency'));

-- agency_staff -> manage_clients
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
((SELECT id FROM permissions WHERE name = 'manage_clients' AND guard_name = 'agency'),
 (SELECT id FROM roles WHERE name = 'agency_staff' AND guard_name = 'agency'));

-- ============================================================
-- 10. EXAMPLE: Creating a new tenant end-to-end
-- ============================================================
-- 1) INSERT INTO tenants (name, slug, status) VALUES ('Acme Recruiting', 'acme', 'active');
-- 2) INSERT INTO agency_users (tenant_id, name, email, password, agency_role, created_by_type, created_by_id, status)
--       VALUES (<tenant_id>, 'Acme Owner', 'owner@acme.com', '<hash>', 'agency', 'admin', <admin_id>, 'active');
-- 3) INSERT INTO agencies (tenant_id, name, owner_agency_user_id, created_by_admin_id, status)
--       VALUES (<tenant_id>, 'Acme Recruiting', <agency_user_id>, <admin_id>, 'active');
-- 4) INSERT INTO domains (tenant_id, domain, type, is_primary)
--       VALUES (<tenant_id>, 'acme.yourapp.com', 'subdomain', true);
-- 5) Assign role: model_has_roles (role_id=<agency role id>, model_type='App\\Models\\AgencyUser', model_id=<agency_user_id>)
--
-- Adding an Agency Staff member (created by the agency owner, not an admin):
-- INSERT INTO agency_users (tenant_id, name, email, password, agency_role, created_by_type, created_by_id, status)
--   VALUES (<tenant_id>, 'Staff Name', 'staff@acme.com', '<hash>', 'agency_staff', 'agency_user', <owner_agency_user_id>, 'active');
--
-- Adding a Client (created by an agency_user):
-- INSERT INTO clients (tenant_id, name, email, password, created_by, status)
--   VALUES (<tenant_id>, 'Client Contact', 'contact@clientco.com', '<hash>', <agency_user_id>, 'active');
