# Database Schema Documentation

**System:** Role-Based Agency Management Platform (Multi-Tenant, Multi-Guard)
**Auth Model:** Three separate tables, each its own Laravel guard
**Permission Layer:** Spatie `laravel-permission` (multi-guard support)
**Tenancy Model:** Single database, shared tables, dedicated `tenants` table
**Tenant Identification:** Subdomain (`acme.yourapp.com`) or verified custom domain (`acme.com`)

---

## Why Three Auth Tables Instead of One `users` Table

| Table | Guard | Roles covered | Tenant-scoped? |
|---|---|---|---|
| `admins` | `admin` | Super Admin, Super Admin Staff | No — platform-level |
| `agency_users` | `agency` | Agency (owner), Agency Staff | Yes — `tenant_id` |
| `clients` | `client` | Agency Client | Yes — `tenant_id` |

**This isn't about table size** — a single `users` table indexed properly handles millions of rows without issue. The real reasons to split:

1. **Security isolation.** A breach or SQL injection against the client-portal login can never expose admin or agency-staff password hashes — they're physically in a different table.
2. **Separate sessions per login surface.** Super Admin logs in on a platform domain (`admin.yourapp.com`), Agency/Staff log in on the tenant's back-office (`acme.yourapp.com/admin`), Clients log in on a customer portal (`acme.yourapp.com/portal`). Each is a distinct Laravel guard with its own session/cookie — no risk of one login accidentally granting access to another surface.
3. **Naturally different fields.** Staff need salary/education/skills; clients need billing/company info; admins need neither. Cramming all three into one table means dozens of always-NULL columns per row.
4. **Spatie already supports this cleanly** — `roles`/`permissions` carry `guard_name`, and the pivot tables (`model_has_roles`, `model_has_permissions`) use `model_type` + `model_id`, so all three guards share the same permission engine with zero structural conflict.

---

## Table of Contents

1. [Tenant Registry](#1-tenant-registry)
2. [Auth Tables (Three Guards)](#2-auth-tables-three-guards)
3. [Agency & Domain Tables](#3-agency--domain-tables)
4. [Spatie Permission Tables (Multi-Guard)](#4-spatie-permission-tables-multi-guard)
5. [Staff Extended Information Tables](#5-staff-extended-information-tables)
6. [Client Extended Information Tables](#6-client-extended-information-tables)
7. [Supporting Tables](#7-supporting-tables)
8. [Entity Relationship Diagram](#8-entity-relationship-diagram)
9. [Relationship Summary](#9-relationship-summary)
10. [Migration & Application Notes](#10-migration--application-notes)

---

## 1. Tenant Registry

### `tenants` ★
| Column | Type | Description |
|---|---|---|
| `id` | BIGINT UNSIGNED (PK) | Internal ID |
| `uuid` | CHAR(36), UNIQUE | Public-safe identifier |
| `name` | VARCHAR(255) | Display name |
| `slug` | VARCHAR(150), UNIQUE | Builds default subdomain |
| `plan` | VARCHAR(50) | Optional billing tier |
| `status` | ENUM | `active`, `inactive`, `suspended` |

---

## 2. Auth Tables (Three Guards)

### `admins` — guard: `admin`
Platform-level only. **Not tenant-scoped.**

| Column | Type | Description |
|---|---|---|
| `id`, `uuid` | | |
| `name`, `email` (unique), `password` | | |
| `admin_role` | ENUM | `super_admin`, `super_admin_staff` |
| `created_by` | FK → `admins.id`, NULLABLE | Self-reference (NULL for the very first super_admin) |
| `status` | ENUM | `active`, `inactive`, `suspended` |

### `agency_users` — guard: `agency`
Tenant-scoped. Covers both the Agency owner account and Agency Staff.

| Column | Type | Description |
|---|---|---|
| `id`, `uuid` | | |
| `tenant_id` | FK → `tenants.id` | Direct tenant scope |
| `name`, `email`, `password` | | `email` unique **per tenant** (`tenant_id` + `email` composite unique) |
| `agency_role` | ENUM | `agency` (the tenant owner) or `agency_staff` |
| `created_by_type` | ENUM | `admin` or `agency_user` — **polymorphic creator** |
| `created_by_id` | BIGINT UNSIGNED | Points to `admins.id` or `agency_users.id` depending on `created_by_type` |
| `status` | ENUM | `active`, `inactive`, `suspended` |

> **Why polymorphic `created_by`:** an Agency owner account is created by a Super Admin/Staff (`admins` table), but an Agency Staff member is created by the Agency owner (another row in `agency_users` itself). One column can't cleanly reference two different tables, so `created_by_type` + `created_by_id` (Laravel's `morphTo` pattern) records both which table and which row.

### `clients` — guard: `client`
Tenant-scoped. Customer portal login only.

| Column | Type | Description |
|---|---|---|
| `id`, `uuid` | | |
| `tenant_id` | FK → `tenants.id` | Direct tenant scope |
| `name`, `email`, `password` | | `email` unique per tenant |
| `created_by` | FK → `agency_users.id` | Only Agency/Agency Staff create clients — single FK, no polymorphism needed |
| `status` | ENUM | `active`, `inactive`, `suspended` |

---

## 3. Agency & Domain Tables

### `agencies`
Business details, 1-to-1 with a tenant.

| Column | Type | Description |
|---|---|---|
| `id`, `uuid` | | |
| `tenant_id` | FK → `tenants.id`, UNIQUE | 1-to-1 |
| `name` | | |
| `owner_agency_user_id` | FK → `agency_users.id`, UNIQUE | The `agency`-role account |
| `created_by_admin_id` | FK → `admins.id` | Which admin created this agency |
| `status` | ENUM | |

### `domains`
| Column | Type | Description |
|---|---|---|
| `id`, `uuid` | | |
| `tenant_id` | FK → `tenants.id` | Which tenant this hostname resolves to |
| `domain` | UNIQUE | e.g. `acme.yourapp.com` or `acme.com` |
| `type` | ENUM | `subdomain`, `custom` |
| `is_primary`, `verified_at`, `ssl_status` | | |

---

## 4. Spatie Permission Tables (Multi-Guard)

`roles` and `permissions` each carry a `guard_name`:

| guard_name | Applies to |
|---|---|
| `admin` | `admins` table / `App\Models\Admin` |
| `agency` | `agency_users` table / `App\Models\AgencyUser` |
| `client` | `clients` table / `App\Models\Client` |

`model_has_roles` / `model_has_permissions` use `model_type` (the PHP class name) + `model_id`, so the same two pivot tables safely serve all three guards — Spatie resolves the right table via `model_type`.

**Seeded roles:**
| Role | Guard |
|---|---|
| `super_admin` | admin |
| `super_admin_staff` | admin |
| `agency` | agency |
| `agency_staff` | agency |
| `agency_client` | client |

---

## 5. Staff Extended Information Tables

> Child tables of `agency_users` (covers `agency` + `agency_staff` roles). No `tenant_id` — derived via `agency_user_id → agency_users.tenant_id`.

| Table | Cardinality | Key columns |
|---|---|---|
| `staff_profiles` | 1-to-1 | `agency_user_id`, dob, phone, address, designation, employment_type |
| `staff_pay_details` | 1-to-many | `agency_user_id`, salary_amount, currency, pay_frequency, effective_date |
| `staff_bank_details` 🔒 | 1-to-1 | `agency_user_id`, account_number (encrypt), iban (encrypt), swift/ifsc |
| `staff_education` | 1-to-many | `agency_user_id`, degree_title, institution_name, start/end_year |
| `skills` | global list | `name` (unique, not scoped to anything) |
| `staff_skills` | many-to-many | `agency_user_id`, `skill_id`, proficiency |
| `staff_documents` | 1-to-many | `agency_user_id`, document_type, file_path, `uploaded_by_agency_user_id` |

---

## 6. Client Extended Information Tables

> Child tables of `clients`. No `tenant_id` — derived via `client_id → clients.tenant_id`.

| Table | Cardinality | Key columns |
|---|---|---|
| `client_profiles` | 1-to-1 | `client_id`, company_name, industry, contact_person, client_status |
| `client_billing_details` 🔒 | 1-to-1 | `client_id`, billing_address, tax_vat_number, payment_terms, `card_last_four` only |
| `client_documents` | 1-to-many | `client_id`, document_type, file_path, `uploaded_by_agency_user_id` |
| `client_notes` | 1-to-many | `client_id`, `author_agency_user_id`, note_type, note |
| `client_staff_assignments` | many-to-many | `client_id`, `agency_user_id`, role_in_assignment |

> ⚠️ Never store full card numbers — only `card_last_four` + a payment gateway customer reference (Stripe/PayPal).

---

## 7. Supporting Tables

### `audit_logs`
Actor can be any of the three guards — handled polymorphically.

| Column | Type | Description |
|---|---|---|
| `id`, `uuid` | | |
| `actor_type` | ENUM | `admin`, `agency_user`, `client` |
| `actor_id` | BIGINT UNSIGNED | Points to the matching table based on `actor_type` |
| `action`, `target_id`, `target_type`, `created_at` | | |

---

## 8. Entity Relationship Diagram

See `erd_diagram.png` / `erd_diagram.pdf`. Solid bold orange edges = direct `tenant_id` (main tables only: `agency_users`, `clients`, `agencies`, `domains`). Dashed edges = child tables deriving tenant through their parent. Dotted edges = polymorphic relationships (`created_by_type`/`actor_type`).

---

## 9. Relationship Summary

| From | To | Type | Meaning |
|---|---|---|---|
| `agency_users.tenant_id` | `tenants.id` | Many-to-1 | Direct tenant scope |
| `clients.tenant_id` | `tenants.id` | Many-to-1 | Direct tenant scope |
| `agencies.tenant_id` | `tenants.id` | 1-to-1 | Direct tenant scope |
| `domains.tenant_id` | `tenants.id` | Many-to-1 | Direct tenant scope |
| `admins.created_by` | `admins.id` | Self-reference | Which admin created this one |
| `agency_users.created_by_id` | `admins.id` OR `agency_users.id` | Polymorphic | Depends on `created_by_type` |
| `clients.created_by` | `agency_users.id` | Many-to-1 | Which staff/agency created this client |
| `agencies.owner_agency_user_id` | `agency_users.id` | 1-to-1 | The agency's own account |
| `agencies.created_by_admin_id` | `admins.id` | Many-to-1 | Which admin created the agency |
| `staff_*.agency_user_id` | `agency_users.id` | Many-to-1 | Tenant derived through this link |
| `client_*.client_id` | `clients.id` | Many-to-1 | Tenant derived through this link |
| `client_notes.author_agency_user_id` | `agency_users.id` | Many-to-1 | Which staff wrote the note |
| `client_staff_assignments.agency_user_id` | `agency_users.id` | Many-to-1 | Which staff manages the client |
| `audit_logs.actor_id` | `admins.id` OR `agency_users.id` OR `clients.id` | Polymorphic | Depends on `actor_type` |

---

## 10. Migration & Application Notes

### Laravel guard config (`config/auth.php`)
```php
'guards' => [
    'admin'  => ['driver' => 'session', 'provider' => 'admins'],
    'agency' => ['driver' => 'session', 'provider' => 'agency_users'],
    'client' => ['driver' => 'session', 'provider' => 'clients'],
],

'providers' => [
    'admins'       => ['driver' => 'eloquent', 'model' => App\Models\Admin::class],
    'agency_users' => ['driver' => 'eloquent', 'model' => App\Models\AgencyUser::class],
    'clients'      => ['driver' => 'eloquent', 'model' => App\Models\Client::class],
],
```

### Each model gets its own guard
```php
class Admin extends Authenticatable
{
    use HasRoles;
    protected string $guard_name = 'admin';
}

class AgencyUser extends Authenticatable
{
    use HasRoles;
    protected string $guard_name = 'agency';
}

class Client extends Authenticatable
{
    use HasRoles;
    protected string $guard_name = 'client';
}
```

### Logging in against the right guard
```php
// Admin platform login (admin.yourapp.com)
Auth::guard('admin')->attempt($credentials);

// Agency back-office login (acme.yourapp.com/admin)
Auth::guard('agency')->attempt($credentials);

// Client portal login (acme.yourapp.com/portal)
Auth::guard('client')->attempt($credentials);
```

### Middleware per route group
```php
Route::middleware('auth:admin')->prefix('admin')->group(function () {
    // Super Admin / Super Admin Staff routes
});

Route::middleware('auth:agency')->group(function () {
    // Agency / Agency Staff back-office routes
});

Route::middleware('auth:client')->group(function () {
    // Client portal routes
});
```

### Creating a new tenant (end-to-end)
```sql
INSERT INTO tenants (name, slug, status) VALUES ('Acme Recruiting', 'acme', 'active');

INSERT INTO agency_users (tenant_id, name, email, password, agency_role, created_by_type, created_by_id, status)
  VALUES (<tenant_id>, 'Acme Owner', 'owner@acme.com', '<hash>', 'agency', 'admin', <admin_id>, 'active');

INSERT INTO agencies (tenant_id, name, owner_agency_user_id, created_by_admin_id, status)
  VALUES (<tenant_id>, 'Acme Recruiting', <agency_user_id>, <admin_id>, 'active');

INSERT INTO domains (tenant_id, domain, type, is_primary)
  VALUES (<tenant_id>, 'acme.yourapp.com', 'subdomain', true);
```

### Adding an Agency Staff member (created by the Agency owner, not an admin)
```sql
INSERT INTO agency_users (tenant_id, name, email, password, agency_role, created_by_type, created_by_id, status)
  VALUES (<tenant_id>, 'Staff Name', 'staff@acme.com', '<hash>', 'agency_staff', 'agency_user', <owner_agency_user_id>, 'active');
```

### Adding a Client
```sql
INSERT INTO clients (tenant_id, name, email, password, created_by, status)
  VALUES (<tenant_id>, 'Client Contact', 'contact@clientco.com', '<hash>', <agency_user_id>, 'active');
```

### Tenant resolution + global scope (unchanged from before)
```php
// Middleware: resolve tenant from hostname
$domain = Domain::where('domain', request()->getHost())->first();
if ($domain) {
    app()->instance('currentTenant', $domain->tenant_id);
}

// Global scope on agency_users / clients / agencies
static::addGlobalScope('tenant', function (Builder $builder) {
    if (app()->bound('currentTenant')) {
        $builder->where('tenant_id', app('currentTenant'));
    }
});
```

### Notes carried over
- **Bank/billing details stay isolated** in their own tables for stricter access control — encrypt sensitive fields at the application layer.
- **Pay details are 1-to-many** so salary changes are tracked via `effective_date`.
- **Skills stay global** — not scoped to tenant or agency_user table, reusable across everyone.
- **Never store full card numbers** — `card_last_four` + payment gateway token only.
