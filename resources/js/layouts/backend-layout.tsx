import { useEffect } from 'react';
import { Head } from '@inertiajs/react';

interface BackendLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function BackendLayout({ children, title }: BackendLayoutProps) {
    useEffect(() => {
        // Load YashAdmin scripts after mount
        const scripts = [
            '/backend/assets/vendor/jquery/dist/jquery.min_3.js',
            '/backend/assets/vendor/bootstrap/dist/js/bootstrap.bundle.min_3.js',
            '/backend/assets/vendor/bootstrap-select/dist/js/bootstrap-select.min_3.js',
            '/backend/assets/vendor/metismenu/dist/metisMenu.min_3.js',
            '/backend/assets/js/deznav-init_3.js',
            '/backend/assets/js/custom_3.js',
            '/backend/assets/js/styleSwitcher_3.js',
        ];

        const loaded: HTMLScriptElement[] = [];

        const loadSequentially = (index: number) => {
            if (index >= scripts.length) return;
            const script = document.createElement('script');
            script.src = scripts[index];
            script.onload = () => loadSequentially(index + 1);
            document.body.appendChild(script);
            loaded.push(script);
        };

        loadSequentially(0);

        return () => {
            loaded.forEach((s) => document.body.removeChild(s));
        };
    }, []);

    return (
        <>
            <Head title={title} />

            {/* YashAdmin CSS */}
            <link rel="stylesheet" href="/backend/assets/vendor/bootstrap-select/dist/css/bootstrap-select.min_4.css" />
            <link rel="stylesheet" href="/backend/assets/css/switcher_4.css" />
            <link rel="stylesheet" href="/backend/assets/css/plugins_4.css" />
            <link rel="stylesheet" href="/backend/assets/css/style_4.css" />

            {/* Preloader */}
            <div id="preloader">
                <div>
                    <img src="/backend/assets/images/pre_4.gif" alt="" />
                </div>
            </div>

            {/* Main Wrapper */}
            <div id="main-wrapper">

                {/* Nav Header */}
                <div className="nav-header">
                    <a href="/" className="brand-logo">
                        <svg className="logo-abbr" width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M31.3287 2.96046L26.3411 0.0805375C26.1549 -0.0268458 25.9256 -0.0268458 25.7394 0.0805375C19.754 3.53731 12.3785 3.53785 6.39259 0.0816161L6.39043 0.0805375C6.20426 -0.0268458 5.97493 -0.0268458 5.78876 0.0805375L0.801104 2.95992C0.614937 3.0673 0.5 3.26588 0.5 3.48119V9.24049C0.5 9.4558 0.614937 9.65438 0.801104 9.76176C6.78759 13.2169 10.4753 19.6038 10.4753 26.5162V26.5184C10.4753 26.7332 10.5903 26.9323 10.7764 27.0397L15.7641 29.9196C15.8574 29.9736 15.961 30 16.0652 30C16.1693 30 16.2729 29.973 16.3663 29.9196L21.3539 27.0397C21.5401 26.9323 21.655 26.7337 21.655 26.5184C21.6545 19.6059 25.3422 13.2185 31.3287 9.7623L31.3298 9.76176C31.516 9.65438 31.6309 9.4558 31.6309 9.24049V3.48173C31.6293 3.26642 31.5149 3.06784 31.3287 2.96046Z" fill="var(--bs-primary)" />
                        </svg>
                    </a>
                    <div className="nav-control">
                        <div className="hamburger">
                            <span className="line">
                                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.7468 5.58925C11.0722 5.26381 11.0722 4.73617 10.7468 4.41073C10.4213 4.0853 9.89369 4.0853 9.56826 4.41073L4.56826 9.41073C4.25277 9.72622 4.24174 10.2342 4.54322 10.5631L9.12655 15.5631C9.43754 15.9024 9.96468 15.9253 10.3039 15.6143C10.6432 15.3033 10.6661 14.7762 10.3551 14.4369L6.31096 10.0251L10.7468 5.58925Z" fill="#452B90" />
                                    <path opacity="0.3" d="M16.5801 5.58924C16.9056 5.26381 16.9056 4.73617 16.5801 4.41073C16.2547 4.0853 15.727 4.0853 15.4016 4.41073L10.4016 9.41073C10.0861 9.72622 10.0751 10.2342 10.3766 10.5631L14.9599 15.5631C15.2709 15.9024 15.798 15.9253 16.1373 15.6143C16.4766 15.3033 16.4995 14.7762 16.1885 14.4369L12.1443 10.0251L16.5801 5.58924Z" fill="#452B90" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
                {/* End Nav Header */}

                {/* Header */}
                <div className="header">
                    <div className="header-content">
                        <nav className="navbar navbar-expand">
                            <div className="collapse navbar-collapse justify-content-between">
                                <div className="header-left">
                                    <form>
                                        <div className="header-search position-relative">
                                            <input type="text" className="form-control" placeholder="Search" />
                                            <span className="input-group-text position-absolute end-0 top-0">
                                                <button className="bg-transparent border-0" aria-label="Search">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path opacity="0.3" d="M14.2929 16.7071C13.9024 16.3166 13.9024 15.6834 14.2929 15.2929C14.6834 14.9024 15.3166 14.9024 15.7071 15.2929L19.7071 19.2929C20.0976 19.6834 20.0976 20.3166 19.7071 20.7071C19.3166 21.0976 18.6834 21.0976 18.2929 20.7071L14.2929 16.7071Z" fill="#452B90" />
                                                        <path d="M11 16C13.7614 16 16 13.7614 16 11C16 8.23859 13.7614 6 11 6C8.23858 6 6 8.23859 6 11C6 13.7614 8.23858 16 11 16ZM11 18C7.13401 18 4 14.866 4 11C4 7.13402 7.13401 4 11 4C14.866 4 18 7.13402 18 11C18 14.866 14.866 18 11 18Z" fill="#452B90" />
                                                    </svg>
                                                </button>
                                            </span>
                                        </div>
                                    </form>
                                </div>
                                <ul className="navbar-nav header-right align-items-center">
                                    {/* Notification */}
                                    <li className="nav-item dropdown notification_dropdown">
                                        <div className="dropdown">
                                            <button className="nav-link bg-white rounded-3 mx-1" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Notifications">
                                                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M17.5 12H19C19.8284 12 20.5 12.6716 20.5 13.5C20.5 14.3284 19.8284 15 19 15H6C5.17157 15 4.5 14.3284 4.5 13.5C4.5 12.6716 5.17157 12 6 12H7.5L8.05827 6.97553C8.30975 4.71226 10.2228 3 12.5 3C14.7772 3 16.6903 4.71226 16.9417 6.97553L17.5 12Z" fill="#222B40" />
                                                    <path opacity="0.3" d="M14.5 18C14.5 16.8954 13.6046 16 12.5 16C11.3954 16 10.5 16.8954 10.5 18C10.5 19.1046 11.3954 20 12.5 20C13.6046 20 14.5 19.1046 14.5 18Z" fill="#222B40" />
                                                </svg>
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-end py-0">
                                                <a className="d-block text-center p-3 border-top" href="#">See all notifications <i className="fa fa-arrow-right"></i></a>
                                            </div>
                                        </div>
                                    </li>
                                    {/* Profile */}
                                    <li className="nav-item dropdown header-profile-dropdown">
                                        <a className="nav-item ps-3 p-0" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <div className="profile-head">
                                                <div className="avatar avatar-sm border-0">
                                                    <img src="/backend/assets/images/user_3.jpg" alt="Profile" />
                                                </div>
                                            </div>
                                        </a>
                                        <ul className="dropdown-menu dropdown-menu-end">
                                            <li>
                                                <a className="dropdown-item" href="/profile">
                                                    <span className="ms-2">Profile</span>
                                                </a>
                                            </li>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li>
                                                <a href="/logout" className="dropdown-item" onClick={(e) => { e.preventDefault(); (document.getElementById('logout-form') as HTMLFormElement)?.submit(); }}>
                                                    <span className="ms-2 text-danger">Logout</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                </div>
                {/* End Header */}

                {/* Sidebar */}
                <div className="deznav">
                    <div className="deznav-scroll">
                        <ul className="metismenu" id="menu">
                            <li className="menu-title">NAVIGATION</li>
                            <li>
                                <a href="/" aria-expanded="false">
                                    <div className="menu-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.13478 20.7733V17.7156C9.13478 16.9351 9.77217 16.3023 10.5584 16.3023H13.4326C13.8102 16.3023 14.1723 16.4512 14.4393 16.7163C14.7063 16.9813 14.8563 17.3408 14.8563 17.7156V20.7733C14.8539 21.0978 14.9821 21.4099 15.2124 21.6402C15.4427 21.8705 15.756 22 16.0829 22H18.0438C18.9596 22.0024 19.8388 21.6428 20.4872 21.0008C21.1356 20.3588 21.5 19.487 21.5 18.5778V9.86686C21.5 9.13246 21.1721 8.43584 20.6046 7.96467L13.934 2.67587C12.7737 1.74856 11.1111 1.7785 9.98539 2.74698L3.46701 7.96467C2.87274 8.42195 2.51755 9.12064 2.5 9.86686V18.5689C2.5 20.4639 4.04738 22 5.95617 22H7.87229C8.55123 22 9.103 21.4562 9.10792 20.7822L9.13478 20.7733Z" fill="#90959F" />
                                        </svg>
                                    </div>
                                    <span className="nav-text">Dashboard</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* End Sidebar */}

                {/* Content Body */}
                <div className="content-body">
                    <div className="container-fluid">
                        {children}
                    </div>
                </div>
                {/* End Content Body */}

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
                {/* End Footer */}

            </div>
            {/* End Main Wrapper */}

            {/* Hidden logout form */}
            <form id="logout-form" action="/logout" method="POST" style={{ display: 'none' }}>
                <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? ''} />
            </form>
        </>
    );
}
