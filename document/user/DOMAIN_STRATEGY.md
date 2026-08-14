# Three-Tier Domain Resolution Strategy

## Overview
The application uses a centralized domain strategy with three tiers:

1. **Centralized/Admin Domain** - Super Admin Access
2. **Agency Domain** - Agency/Tenant Access
3. **No Match** - Display Contact Information

---

## Tier 1: Centralized Admin Domain

### What is it?
- Domain dedicated to **super admin/platform administrators only**
- No tenant is loaded/selected
- Admin can manage all agencies, tenants, and system settings

### Configuration
Set in `.env`:
```env
ADMIN_DOMAIN=admin.localhost
```

Or in `config/app.php`:
```php
'admin_domain' => env('ADMIN_DOMAIN', 'admin.localhost'),
```

### Domain Patterns Recognized
- `admin.localhost`
- `admin.yourapp.com`
- Any domain starting with `admin.`

### Access
- Super Admin login panel
- Platform-wide management
- System configuration
- Agency management
- Domain verification

### Example
```
Request: http://admin.localhost/login
Response: Show super admin login panel (no tenant context)
```

---

## Tier 2: Agency Domain

### What is it?
- **Subdomain** based on tenant slug (e.g., `acme.yourapp.com`)
- **Custom domain** mapped to specific tenant (e.g., `acme.com`)
- Agency staff and clients access

### How it Works

#### 2a. Subdomain Resolution
```
Request Host: acme.yourapp.com
1. Extract subdomain: "acme"
2. Query: Tenant::where('slug', 'acme')->first()
3. Set tenant as current
4. Load agency-specific data
```

#### 2b. Custom Domain Resolution
```
Request Host: acme.com
1. Query: Domain::where('domain', 'acme.com')->first()
2. Check: verified_at IS NOT NULL
3. Get associated Tenant
4. Set tenant as current
5. Load agency-specific data
```

### Configuration in Database

**Create a tenant with slug:**
```php
$tenant = Tenant::create([
    'name' => 'Acme Recruitment Agency',
    'slug' => 'acme',      // ← Used for subdomain
    'plan' => 'premium',
    'status' => 'active',
]);
```

**Add subdomain:**
```php
$tenant->domains()->create([
    'domain' => 'acme.yourapp.com',
    'type' => 'subdomain',
    'is_primary' => true,
    'verified_at' => now(),  // Must be verified!
]);
```

**Add custom domain:**
```php
$tenant->domains()->create([
    'domain' => 'acme.com',
    'type' => 'custom',
    'is_primary' => false,
    'verified_at' => now(),  // Must be verified!
    'ssl_status' => 'active',
]);
```

### Access
- Agency owner login
- Agency staff portal
- Client dashboard
- Agency-specific settings

### Examples
```
Request: http://acme.yourapp.com/
Response: Load Tenant where slug='acme', show agency portal

Request: http://acme.com/
Response: Find Domain where domain='acme.com', load tenant, show agency portal
```

---

## Tier 3: No Match - Contact Information

### What is it?
- Request domain does **not** match centralized domain
- Request domain does **not** match any registered tenant domain
- Request subdomain does **not** match any tenant slug

### Response
Display a **contact information page** or redirect to main site

### Implementation
The middleware sets `show_contact_info` flag:
```php
if (!$tenant && !$is_admin_domain) {
    $request->attributes->set('show_contact_info', true);
}
```

### Use Cases
- User visits `unknown.com`
- User visits `localhost:8000` without subdomain
- User visits `www.yourapp.com`
- Unregistered subdomain like `test.yourapp.com`

### Example
```
Request: http://unknown.com/
Response: Show contact information page
"This domain is not registered. For support, contact: support@example.com"
```

---

## Request Flow Diagram

```
Incoming Request
       ↓
   Get Host/Domain
       ↓
   ┌─────────────────────────────────────────┐
   │ Is it Centralized Domain?               │
   │ (admin.* or ADMIN_DOMAIN)               │
   └────────────────────────────────────────┬┘
        │ YES                          │ NO
        ↓                              ↓
   TIER 1: SUPERADMIN            ┌──────────────────────────┐
   - No tenant                    │ Try Agency Domain Lookup │
   - Admin panel                  └──────────────────────────┘
   - System settings                       │
                            ┌──────────────┴───────────────┐
                            ↓                              ↓
                      Try Domain Table            Try Subdomain
                      Exact Match?                Extraction?
                            │                              │
                        YES │ NO                       YES │ NO
                            ↓                              ↓
                     TIER 2: AGENCY              TIER 2: AGENCY
                     - Load Tenant               - Match slug
                     - Agency Portal            - Load Tenant
                     - Tenant context           - Agency Portal
                                                - Tenant context
                                                       │
                                                    NO │ (no match)
                                                       ↓
                                          TIER 3: NO MATCH
                                          - Show Contact Info
                                          - Redirect to Main
```

---

## Implementation Files

### Core Files
- **DomainTenantFinder** (`app/TenantFinder/DomainTenantFinder.php`)
  - Spatie TenantFinder implementation
  - Resolves tenant from request
  - Handles all 3 tiers

- **ResolveTenantFromDomain** (`app/Http/Middleware/ResolveTenantFromDomain.php`)
  - HTTP middleware
  - Sets request attributes for each tier
  - Available as `request()->attributes`

- **Tenant Model** (`app/Models/Tenant.php`)
  - Implements IsTenant interface
  - Has domains() relationship
  - Auto-generates UUID

- **Domain Model** (`app/Models/Domain.php`)
  - Represents domains mapped to tenants
  - Tracks verification status
  - SSL status monitoring

### Configuration
- **config/multitenancy.php**
  - Uses DomainTenantFinder
  - Configured for domain-based resolution

- **.env**
  ```env
  ADMIN_DOMAIN=admin.localhost
  ```

### Migrations
- **2026_07_26_000000_create_tenants_table.php**
  - id, uuid, name, slug, plan, status

- **2026_07_26_000001_create_domains_table.php**
  - id, uuid, tenant_id, domain, type, is_primary, verified_at, ssl_status

---

## Usage in Routes/Controllers

### Detect Current Tier
```php
// In middleware or controller
if (request()->attributes->get('is_admin_domain')) {
    // TIER 1: Super Admin
    return redirect('/admin-panel');
}

if (request()->attributes->get('is_agency_domain')) {
    // TIER 2: Agency/Tenant
    $tenant = app('currentTenant');
    // Use tenant context
}

if (request()->attributes->get('show_contact_info')) {
    // TIER 3: No Match
    return view('contact-info');
}
```

### Get Current Tenant (Tier 2 only)
```php
use Spatie\Multitenancy\Facades\Multitenancy;

$tenant = Multitenancy::tenant();
// or
$tenant = app('currentTenant');
```

### Create Routes per Tier

**Admin Routes:**
```php
Route::domain('admin.{app?}')->middleware(['auth:admin', 'admin.only'])->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'show']);
    Route::resource('agencies', AgencyController::class);
});
```

**Agency Routes:**
```php
Route::middleware(['auth:agency', 'tenant.required'])->group(function () {
    Route::get('/dashboard', [AgencyDashboardController::class, 'show']);
    Route::resource('staff', StaffController::class);
});
```

**Fallback Routes:**
```php
Route::fallback(function () {
    if (request()->attributes->get('show_contact_info')) {
        return view('pages.contact-info');
    }
    return redirect('/');
});
```

---

## Database Examples

### Create Complete Setup
```php
// 1. Create Tenant
$tenant = Tenant::create([
    'name' => 'Acme Recruitment',
    'slug' => 'acme',
    'plan' => 'premium',
]);

// 2. Add Subdomain
$tenant->domains()->create([
    'domain' => 'acme.yourapp.com',
    'type' => 'subdomain',
    'is_primary' => true,
    'verified_at' => now(),
]);

// 3. Add Custom Domain
$tenant->domains()->create([
    'domain' => 'acme.com',
    'type' => 'custom',
    'is_primary' => false,
    'verified_at' => now(),
    'ssl_status' => 'active',
]);
```

### Query Examples
```php
// Get tenant by slug (Tier 2 - subdomain)
$tenant = Tenant::where('slug', 'acme')->first();

// Get tenant by custom domain (Tier 2 - custom domain)
$domain = Domain::where('domain', 'acme.com')
    ->where('verified_at', '!=', null)
    ->first();
$tenant = $domain->tenant;

// Get all domains for a tenant
$domains = $tenant->domains()->get();

// Get primary domain
$primaryDomain = $tenant->primaryDomain;

// Get verified domains only
$verifiedDomains = $tenant->domains()
    ->whereNotNull('verified_at')
    ->get();
```

---

## Security Considerations

1. **Always verify domains** before setting `verified_at`
2. **Use HTTPS** for custom domains (check `ssl_status`)
3. **Implement DNS validation** for custom domains
4. **Rate limit** domain resolution attempts
5. **Log** unresolved domain requests (Tier 3)
6. **Validate** subdomain patterns against regex
7. **Prevent** admin domain spoofing in configuration

---

## Troubleshooting

### Issue: Admin domain not recognized
- Check `.env` ADMIN_DOMAIN value
- Verify domain matches exactly or starts with `admin.`
- Clear cache: `php artisan config:cache`

### Issue: Agency domain not resolving
- Verify Domain record has `verified_at` NOT NULL
- Check `slug` matches subdomain exactly
- Verify DNS points to application

### Issue: Shows Tier 3 (contact info) instead of agency
- Check Domain or Tenant exists
- Verify Domain `verified_at` is set
- Check tenant `status` is 'active'
- Review logs for resolution failures

---

## Future Enhancements
- [ ] Bulk domain import
- [ ] Automatic SSL provisioning
- [ ] Domain health monitoring
- [ ] Subdomain wildcard support (*.acme.com)
- [ ] Multi-domain analytics
- [ ] Domain migration helpers
