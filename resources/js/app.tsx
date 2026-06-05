import { createInertiaApp } from '@inertiajs/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';
import LandingLayout from '@/layouts/landing-layout';
import MasterLayout from '@/layouts/backend/MasterLayout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const pages = import.meta.glob<{ default: any }>('./pages/**/*.tsx', { eager: true });
        return pages[`./pages/${name}.tsx`];
    },
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name === 'home':
            case name === 'Flights':
            case name === 'Hotels':
            case name === 'Visas':
            case name === 'frontend/flight/flight':
            case name === 'frontend/hotel/hotels':
            case name === 'frontend/visa/visas':
            case name === 'frontend/flight/flight-results':
            case name === 'frontend/hotel/hotel-results':
            case name === 'frontend/visa/visa-results':
            case name === 'tours':
            case name === 'TourDetail':
            case name === 'tickets':
            case name === 'visa-services':
            case name === 'other-services':
            case name === 'about-us':
            case name === 'contact-us':
                return LandingLayout;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            // Admin pages use MasterLayout
            case name.startsWith('Admin/'):
            case name === 'admin/bookings':
                return MasterLayout;
            // Backend pages manage their own layout via MasterLayout
            case name === 'dashboard':
            case name.startsWith('agency/'):
                return null;
            // Frontend service pages use LandingLayout
            case name.startsWith('frontend/'):
                return LandingLayout;
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return <TooltipProvider delayDuration={0}>{app}</TooltipProvider>;
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
