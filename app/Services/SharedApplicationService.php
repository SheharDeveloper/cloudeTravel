<?php

namespace App\Services;

use App\Mail\ApplicationShareOtp;
use App\Models\BookingApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Validation\ValidationException;

/**
 * "Share Application": the agency shares a link to one application's form.
 * Whoever opens it confirms the applicant's email with an OTP, then fills the
 * application without logging in.
 *
 * - The link is a signed URL: it cannot be guessed or changed.
 * - With email OTP on (APPLICATION_SHARE_EMAIL_OTP=true) a new OTP is emailed
 *   to the applicant; with it off, no email is sent and the default OTP
 *   (APPLICATION_SHARE_DEFAULT_OTP, 11111) is used.
 * - Passing the check is remembered in the visitor's session.
 */
class SharedApplicationService
{
    private const OPENED = 'shared_application.opened.';
    private const VERIFIED = 'shared_application.verified.';

    public function __construct(protected DocumentSignService $signService)
    {
    }

    /** The link to share, on the domain the agency is using now. */
    public function shareUrl(BookingApplication $application): string
    {
        return URL::signedRoute('application.share', ['uid' => $application->uid]);
    }

    /** The email the visitor must confirm: the applicant's own, else the booking client's. */
    public function email(BookingApplication $application): ?string
    {
        $application->loadMissing('booking.client');

        return $application->email ?: $application->booking->client?->email;
    }

    public function emailOtpEnabled(): bool
    {
        return (bool) config('application_share.email_otp');
    }

    public function find(string $uid): BookingApplication
    {
        return BookingApplication::where('uid', $uid)->firstOrFail();
    }

    /** Opened through a valid shared link: the OTP form may be used. */
    public function markOpened(Request $request, BookingApplication $application): void
    {
        $request->session()->put(self::OPENED . $application->uid, true);
    }

    public function wasOpened(Request $request, BookingApplication $application): bool
    {
        return (bool) $request->session()->get(self::OPENED . $application->uid);
    }

    public function isVerified(Request $request, BookingApplication $application): bool
    {
        return (bool) $request->session()->get(self::VERIFIED . $application->uid);
    }

    /**
     * "Send OTP": checks the email is the application's, then emails a new
     * OTP (email OTP on). With email OTP off nothing is sent — the default
     * OTP is used.
     */
    public function sendOtp(BookingApplication $application, string $email): void
    {
        $this->checkEmail($application, $email);

        if (! $this->emailOtpEnabled()) {
            return;
        }

        $otp = (string) random_int(10000, 99999);
        $minutes = max(1, (int) config('application_share.otp_minutes', 10));
        Cache::put($this->otpKey($application), Hash::make($otp), now()->addMinutes($minutes));

        $application->loadMissing('booking.owner');
        Mail::to($this->email($application))
            ->send(new ApplicationShareOtp($application, $otp, $minutes, $this->signService->branding($application->booking)));
    }

    /** Checks the email and OTP; on success the visitor may fill the application. */
    public function verify(Request $request, BookingApplication $application, string $email, string $otp): void
    {
        $this->checkEmail($application, $email);
        $otp = trim($otp);

        if ($this->emailOtpEnabled()) {
            $hash = Cache::get($this->otpKey($application));
            if (! $hash) {
                throw ValidationException::withMessages(['otp' => 'The OTP has expired or was not sent. Send a new OTP.']);
            }
            if (! Hash::check($otp, $hash)) {
                throw ValidationException::withMessages(['otp' => 'The OTP is not correct.']);
            }
            Cache::forget($this->otpKey($application));
        } elseif (! hash_equals((string) config('application_share.default_otp'), $otp)) {
            throw ValidationException::withMessages(['otp' => 'The OTP is not correct.']);
        }

        $request->session()->regenerate();
        $request->session()->put(self::VERIFIED . $application->uid, true);
    }

    private function checkEmail(BookingApplication $application, string $email): void
    {
        $expected = $this->email($application);

        if (! $expected || strcasecmp(trim($email), $expected) !== 0) {
            throw ValidationException::withMessages(['email' => 'This email does not match the application.']);
        }
    }

    private function otpKey(BookingApplication $application): string
    {
        return 'shared_application.otp.' . $application->uid;
    }
}
