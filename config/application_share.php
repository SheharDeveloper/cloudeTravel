<?php

return [
    /*
     * "Share Application": whoever opens the shared link confirms the
     * applicant's email with an OTP, then fills the application without
     * logging in.
     *
     * email_otp on:  a new OTP is emailed to the applicant each time they ask.
     * email_otp off: no email is sent; the default OTP below is used instead.
     */
    'email_otp' => (bool) env('APPLICATION_SHARE_EMAIL_OTP', false),

    'default_otp' => (string) env('APPLICATION_SHARE_DEFAULT_OTP', '11111'),

    // How long an emailed OTP stays valid
    'otp_minutes' => (int) env('APPLICATION_SHARE_OTP_MINUTES', 10),
];
