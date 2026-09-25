<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\ResolveTenantFromDomain;
use App\Http\Middleware\RewriteTenantPathPrefix;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state', 'auth_token', 'tenant_path']);

        // Genuinely global — runs before routing, for every request (web and
        // api alike) — so a tenant path prefix is stripped before Laravel
        // ever matches a route. See the class docblock.
        $middleware->prepend(RewriteTenantPathPrefix::class);

        $middleware->web(prepend: [
            ResolveTenantFromDomain::class,
        ], append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        // The public content endpoints (hero images, testimonials, special
        // offers, contact info, documents) need to know which agency's
        // domain they're being called from too.
        $middleware->api(prepend: [
            ResolveTenantFromDomain::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
