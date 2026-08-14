# Domain-Based Tenancy Setup

## Overview
This document describes the domain-based tenant resolution system for the multi-tenant application.

## Schema

### Tenants Table
```
tenants
├── id (BIGINT UNSIGNED, PK)
├── uuid (CHAR(36), UNIQUE)
├── name (VARCHAR(255))
├── slug (VARCHAR(150), UNIQUE)  ← For subdomain extraction
├── plan (VARCHAR(50), NULLABLE)
├── status (ENUM: active, inactive, suspended)
└── timestamps
```

### Domains Table
```
domains
├── id (BIGINT UNSIGNED, PK)
├── uuid (CHAR(36), UNIQUE)
├── tenant_id (FK → tenants.id, CASCADE)
├── domain (VARCHAR(255), UNIQUE)  ← e.g., "acme.com" or "acme.yourapp.com"
├── type (ENUM: subdomain, custom)
├── is_primary (BOOLEAN)
├── verified_at (TIMESTAMP, NULLABLE)  ← When domain was verified
├── ssl_status (ENUM: pending, active, failed)
└── timestamps
```

## How Domain Resolution Works

### 1. Subdomain-Based Access
**Request:** `acme.yourapp.com`
1. Extract subdomain: "acme"
2. Find Tenant where slug = "acme"
3. Set tenant as current

### 2. Custom Domain Access
**Request:** `acme.com`
1. Look up Domain record where domain = "acme.com"
2. Verify domain is verified (verified_at IS NOT NULL)
3. Get associated Tenant from Domain
4. Set tenant as current

## Implementation Files

### 1. Models
- **[Tenant.php](app/Models/Tenant.php)**
  - `domains()` - has many relationship
  - `primaryDomain()` - has one relationship for primary domain
  - Auto-generates UUID on creation

- **[Domain.php](app/Models/Domain.php)**
  - `tenant()` - belongs to relationship
  - `isPrimary()`, `isVerified()`, `isCustomDomain()`, `isSubdomain()` - helper methods
  - `markAsVerified()`, `markAsSSLActive()`, `markAsSSLFailed()` - status methods

### 2. Tenant Finder
- **[DomainTenantFinder.php](app/TenantFinder/DomainTenantFinder.php)**
  - Extends Spatie's TenantFinder
  - Resolves tenant from incoming HTTP request
  - Tries custom domain first, then subdomain

### 3. Middleware
- **[ResolveTenantFromDomain.php](app/Http/Middleware/ResolveTenantFromDomain.php)**
  - Optional middleware for explicit domain resolution
  - Can be registered globally or per route group

### 4. Configuration
- **[config/multitenancy.php](config/multitenancy.php)**
  - Uses `DomainTenantFinder` by default
  - Configured for domain-based tenant resolution

### 5. Migrations
- **2026_07_26_000000_create_tenants_table.php**
  - Creates tenants table with schema
  
- **2026_07_26_000001_create_domains_table.php**
  - Creates domains table with foreign key to tenants
  - Creates indexes on tenant_id and (tenant_id, is_primary)

## Usage Examples

### 1. Create a Tenant
```php
$tenant = Tenant::create([
    'name' => 'Acme Recruiting',
    'slug' => 'acme',
    'plan' => 'premium',
    'status' => 'active',
]);
```

### 2. Add a Subdomain
```php
$tenant->domains()->create([
    'domain' => 'acme.yourapp.com',
    'type' => 'subdomain',
    'is_primary' => true,
    'verified_at' => now(),
]);
```

### 3. Add a Custom Domain
```php
$tenant->domains()->create([
    'domain' => 'acme.com',
    'type' => 'custom',
    'is_primary' => true,
    'ssl_status' => 'pending',
]);
```

### 4. Verify a Domain
```php
$domain = Domain::where('domain', 'acme.com')->first();
$domain->markAsVerified();
$domain->markAsSSLActive();
```

### 5. Get Current Tenant (in middleware/routes)
```php
use Spatie\Multitenancy\Facades\Multitenancy;

$tenant = Multitenancy::tenant();
// or
$tenant = app('currentTenant');
```

## Database Requirements
- MySQL 5.7+ or MariaDB 10.2+
- Foreign key constraints must be enabled
- UUID support (DEFAULT (UUID()) is optional, handled by model)

## Migration Order
Ensure migrations run in order:
1. Create tenants table first
2. Create domains table second (references tenants)
3. Create other tenant-related tables after

## Troubleshooting

### Foreign Key Constraint Error
If you see: `Can't create table ... Foreign key constraint is incorrectly formed (errno: 150)`

Check:
1. Tenants table exists
2. Tenants table has BIGINT UNSIGNED id
3. Domains tenant_id is also BIGINT UNSIGNED
4. Foreign key constraints are enabled in MySQL

### Tenant Not Resolving
1. Check Domain record has `verified_at` set (not NULL)
2. Verify DNS points to your application server
3. Check application .env has correct APP_URL
4. Review DomainTenantFinder logic

## Security Considerations
- Always verify domains before marking `verified_at`
- Use SSL certificates (check `ssl_status`)
- Implement rate limiting on domain resolution
- Log domain resolution failures
- Validate domain names against regex patterns

## Future Enhancements
- [ ] Bulk domain upload/management
- [ ] Automatic SSL certificate provisioning
- [ ] Domain health monitoring
- [ ] Email notifications for domain expiry
- [ ] Custom domain CNAME verification
