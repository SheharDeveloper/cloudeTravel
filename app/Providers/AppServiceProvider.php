<?php

namespace App\Providers;

use App\Models\Agency;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureInertiaTenantUrls();
    }

    /**
     * RewriteTenantPathPrefix strips a leading /{slug} before routing, so
     * the request Inertia sees internally has that prefix already gone —
     * left alone, Inertia would report the stripped path back to the
     * browser as the page's own URL, and its client would then silently
     * correct the address bar to match, undoing the prefix on every
     * navigation. This puts the slug back for display purposes only;
     * routing itself is unaffected; the browser keeps showing /{slug}/....
     *
     * Applies whenever a tenant is resolved at all — including from the
     * sticky tenant_path cookie, not only when the prefix was typed or
     * clicked this time — so a plain, unprefixed link (nothing elsewhere in
     * the app needs to know about the prefix) still lands the browser on
     * /{slug}/..., matching how a real subdomain behaves on every page.
     *
     * /admin/* is shared by two different identities (see routes/web.php):
     * agency staff (guard 'agency') legitimately browsing their own tenant's
     * panel — who should keep seeing /{slug}/admin/..., same as everywhere
     * else — and the superadmin (guard 'web'), whose panel is never
     * tenant-scoped no matter what a stale cookie from browsing some
     * agency's public site earlier says. Only the second case is excluded.
     */
    protected function configureInertiaTenantUrls(): void
    {
        Inertia::resolveUrlUsing(function (Request $request) {
            $url = Str::start(Str::after($request->fullUrl(), $request->getSchemeAndHttpHost()), '/');

            if (($slug = $request->attributes->get('tenant_path')) && !Auth::guard('web')->check()) {
                $url = $url === '/' ? "/{$slug}" : "/{$slug}{$url}";
            }

            return $url;
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
