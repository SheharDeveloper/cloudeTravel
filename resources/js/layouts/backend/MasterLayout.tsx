import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Loader from '@/components/Loader';

// Set body attributes immediately (outside component) so CSS selectors work on first paint
function applyBodyAttrs() {
    const attrs: Record<string, string> = {
        'data-theme-version': 'light',
        'data-bs-theme': 'light',
        'data-typography': 'poppins',
        'data-layout': 'vertical',
        'data-nav-headerbg': 'color_2',
        'data-headerbg': 'color_1',
        'data-sidebarbg': 'color_2',
        'data-sidebar-style': 'full',
        'data-sidebar-position': 'fixed',
        'data-header-position': 'fixed',
        'data-container': 'wide',
        'data-primary': 'color_3',
        'data-language': 'en_GB',
        direction: 'ltr',
    };
    Object.entries(attrs).forEach(([k, v]) => document.body.setAttribute(k, v));
    document.documentElement.setAttribute('dir', 'ltr');
}

if (typeof document !== 'undefined') {
    applyBodyAttrs();
}

interface MasterLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function MasterLayout({ children, title }: MasterLayoutProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Re-apply in case of SSR hydration
        applyBodyAttrs();

        // Load JS scripts sequentially
        const scripts = [
            '/backend/assets/vendor/jquery/dist/jquery.min_3.js',
            '/backend/assets/vendor/bootstrap/dist/js/bootstrap.bundle.min_3.js',
            '/backend/assets/vendor/bootstrap-select/dist/js/bootstrap-select.min_3.js',
            '/backend/assets/vendor/metismenu/dist/metisMenu.min_3.js',
            '/backend/assets/js/custom_3.js',
        ];

        const loadedScripts: HTMLScriptElement[] = [];

        // Show main wrapper immediately — don't wait for preloader
        const wrapper = document.getElementById('main-wrapper');
        if (wrapper) wrapper.classList.add('show');
        const preloader = document.getElementById('preloader');
        if (preloader) preloader.style.display = 'none';

        const loadNext = (index: number) => {
            if (index >= scripts.length) return;
            // Avoid duplicate script tags
            if (document.querySelector(`script[src="${scripts[index]}"]`)) {
                loadNext(index + 1);
                return;
            }
            const script = document.createElement('script');
            script.src = scripts[index];
            script.onload = () => loadNext(index + 1);
            document.body.appendChild(script);
            loadedScripts.push(script);
        };

        loadNext(0);

        return () => {
            loadedScripts.forEach((s) => s.remove());
        };
    }, []);

    // Hide loader when page is fully loaded (CSS, images, etc.)
    useEffect(() => {
        if (document.readyState === 'complete') {
            setIsLoading(false);
        } else {
            const handleLoad = () => setIsLoading(false);
            window.addEventListener('load', handleLoad);
            return () => window.removeEventListener('load', handleLoad);
        }
    }, []);

    return (
        <>
            <Head title={title}>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3H0DmJwNmKktHrywFFUcpkAtgqisB2Zl8kQKeK2tYeZszBg5+d+gfeXsNMic32dEVVZ1PsLIYEg==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                <link rel="stylesheet" href="/backend/assets/vendor/bootstrap-select/dist/css/bootstrap-select.min_4.css" />
                <link rel="stylesheet" href="/backend/assets/css/switcher_4.css" className="main-switcher" />
                <link rel="stylesheet" href="/backend/assets/css/plugins_4.css" className="main-plugins" />
                <link rel="stylesheet" href="/backend/assets/css/style_4.css" className="main-css" />
            </Head>

            {/* Global Loader Overlay */}
            {isLoading && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f8f9fa',
                    zIndex: 9999,
                }}>
                    <Loader />
                </div>
            )}

            {/* Preloader — hidden immediately in React, shown only on full page load */}
            <div id="preloader" style={{ display: 'none' }}>
                <div>
                    <img src="/backend/assets/images/pre_4.gif" alt="" />
                </div>
            </div>

            {/* Main Wrapper — show immediately, don't wait for JS preloader */}
            <div id="main-wrapper" className="show">

                {/* Navbar: nav-header (logo) + top header bar */}
                <Navbar />

                {/* Sidebar */}
                <Sidebar />

                {/* Page Content */}
                <div className="content-body">
                    <div className="container-fluid">
                        {children}
                    </div>
                </div>

                {/* Footer */}
                <div className="footer">
                    <div className="copyright text-center">
                        <p className="mb-0">
                            Copyright &copy; Developed by{' '}
                            <a href="https://dexignzone.com" target="_blank" rel="noreferrer">DexignZone</a>{' '}
                            {new Date().getFullYear()}
                        </p>
                    </div>
                </div>

            </div>

        </>
    );
}
