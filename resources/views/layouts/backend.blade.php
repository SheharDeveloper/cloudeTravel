<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <title>@yield('title', config('app.name', 'Laravel'))</title>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Favicon -->
    <link rel="shortcut icon" type="image/png" href="{{ asset('backend/assets/images/favicon_4.png') }}">

    <!-- Plugins CSS -->
    <link href="{{ asset('backend/assets/vendor/bootstrap-select/dist/css/bootstrap-select.min_4.css') }}" rel="stylesheet">

    <!-- Switcher CSS -->
    <link href="{{ asset('backend/assets/css/switcher_4.css') }}" rel="stylesheet">

    <!-- Main CSS -->
    <link class="main-plugins" href="{{ asset('backend/assets/css/plugins_4.css') }}" rel="stylesheet">
    <link class="main-css" href="{{ asset('backend/assets/css/style_4.css') }}" rel="stylesheet">

    @stack('styles')
</head>
<body>

    <!-- Preloader -->
    <div id="preloader">
        <div>
            <img src="{{ asset('backend/assets/images/pre_4.gif') }}" alt="">
        </div>
    </div>

    <!-- Main Wrapper -->
    <div id="main-wrapper">

        <!-- Nav Header -->
        @include('layouts.partials.backend.nav-header')

        <!-- Sidebar Chat Box -->
        @include('layouts.partials.backend.chatbox')

        <!-- Header -->
        @include('layouts.partials.backend.header')

        <!-- Sidebar Navigation -->
        @include('layouts.partials.backend.sidebar')

        <!-- Content Body -->
        <div class="content-body">
            <div class="container-fluid">
                @yield('content')
            </div>
        </div>
        <!-- End Content Body -->

        <!-- Footer -->
        <div class="footer">
            <div class="copyright text-center">
                <p class="mb-0">Copyright &copy; Developed by
                    <a href="https://dexignzone.com" target="_blank">DexignZone</a>
                    <span class="current-year">{{ date('Y') }}</span>
                </p>
            </div>
        </div>

    </div>
    <!-- End Main Wrapper -->

    <!-- Scripts -->
    <script src="{{ asset('backend/assets/vendor/jquery/dist/jquery.min_3.js') }}"></script>
    <script src="{{ asset('backend/assets/vendor/bootstrap/dist/js/bootstrap.bundle.min_3.js') }}"></script>
    <script src="{{ asset('backend/assets/vendor/bootstrap-select/dist/js/bootstrap-select.min_3.js') }}"></script>
    <script src="{{ asset('backend/assets/vendor/metismenu/dist/metisMenu.min_3.js') }}"></script>
    <script src="{{ asset('backend/assets/vendor/apexcharts/dist/apexcharts.min_3.js') }}"></script>
    <script src="{{ asset('backend/assets/vendor/i18n/i18n_3.js') }}"></script>
    <script src="{{ asset('backend/assets/js/translator_3.js') }}"></script>
    <script src="{{ asset('backend/assets/js/deznav-init_3.js') }}"></script>
    <script src="{{ asset('backend/assets/js/custom_3.js') }}"></script>
    <script src="{{ asset('backend/assets/js/styleSwitcher_3.js') }}"></script>

    @stack('scripts')

</body>
</html>
