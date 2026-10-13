<?php

namespace App\Http\Controllers;

use App\Models\ApplicationFormLog;
use App\Models\BookingApplication;
use App\Services\ApplicationFormService;
use App\Services\DocumentSignService;
use App\Services\SharedApplicationService;
use App\Services\VisaApplicationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

/**
 * A shared application (the agency's "Share Application" link): confirm the
 * email and OTP, then fill the application form — no login.
 */
class SharedApplicationController extends Controller
{
    public function __construct(
        protected SharedApplicationService $share,
        protected VisaApplicationService $applications,
        protected ApplicationFormService $forms,
        protected DocumentSignService $signService,
    ) {
    }

    /** The signed link: the email + OTP form, or the application once confirmed. */
    public function show(Request $request, string $uid)
    {
        $application = $this->share->find($uid);
        $this->share->markOpened($request, $application);

        return $this->page($request, $application);
    }

    /** "Send OTP": emails a new OTP to the applicant (or, with email OTP off, nothing to send). */
    public function sendOtp(Request $request, string $uid)
    {
        $application = $this->share->find($uid);
        abort_unless($this->share->wasOpened($request, $application), 403, 'Open the shared link again.');

        $validated = $request->validate(['email' => 'required|email|max:255']);
        $this->share->sendOtp($application, $validated['email']);

        return back()->with('success', $this->share->emailOtpEnabled()
            ? 'We have emailed you an OTP. Enter it below.'
            : 'Enter your OTP below.');
    }

    public function verify(Request $request, string $uid)
    {
        $application = $this->share->find($uid);
        abort_unless($this->share->wasOpened($request, $application), 403, 'Open the shared link again.');

        $validated = $request->validate([
            'email' => 'required|email|max:255',
            'otp' => 'required|string|max:10',
        ], [
            'otp.required' => 'Enter the OTP.',
        ]);

        $this->share->verify($request, $application, $validated['email'], $validated['otp']);

        return redirect()->to(url()->previous());
    }

    /** "Fill Application": save as a draft, or submit (required fields checked). */
    public function saveForm(Request $request, string $uid)
    {
        $application = $this->verified($request, $uid);
        $validated = $request->validate([
            'answers' => 'present|array',
            'answers.*' => 'nullable|string|max:20000',
            'submit' => 'boolean',
            'quiet' => 'boolean',
        ]);

        $submit = (bool) ($validated['submit'] ?? false);
        // Filled by the applicant themselves: logged as the client's change
        $this->applications->saveForm($application, $validated['answers'], $submit, null, ApplicationFormLog::ROLE_CLIENT);

        if (! empty($validated['quiet'])) {
            return back();
        }

        return back()->with('success', $submit ? 'Application form submitted.' : 'Application form saved as a draft.');
    }

    public function uploadFormFile(Request $request, string $uid)
    {
        $application = $this->verified($request, $uid);
        $request->validate([
            'file' => 'required|file|max:10240|mimes:pdf,jpg,jpeg,png,webp,doc,docx',
        ], [
            'file.max' => 'The file may not be larger than 10 MB.',
            'file.mimes' => 'Upload a PDF, image (JPG, PNG, WEBP) or Word document.',
        ]);

        return response()->json(['value' => $this->forms->storeFile($application, $request->file('file'))]);
    }

    public function formFile(Request $request, string $uid)
    {
        $application = $this->verified($request, $uid);
        $path = (string) $request->query('path', '');
        abort_unless($this->forms->ownsFile($application, $path), 404);

        return Storage::disk('local')->response($path, basename((string) $request->query('name', basename($path))));
    }

    private function page(Request $request, BookingApplication $application)
    {
        $application->loadMissing('booking.owner');
        $booking = $application->booking;
        $verified = $this->share->isVerified($request, $application);
        $d = $booking->details ?? [];

        return Inertia::render('Public/SharedApplication', [
            'brand' => $this->signService->branding($booking),
            'verified' => $verified,
            'sendOtpUrl' => route('application.share.otp', $application->uid),
            'verifyUrl' => route('application.share.verify', $application->uid),
            // Email OTP on: "Send OTP" emails one; off: the default OTP works, nothing is sent
            'emailOtp' => $this->share->emailOtpEnabled(),
            'summary' => [
                'application_number' => $application->application_number,
                'name' => trim("{$application->first_name} {$application->last_name}"),
                'visa' => trim(implode(' · ', array_filter([$d['visa_name'] ?? null, $d['visa_type'] ?? null]))),
                'route' => trim(implode(' To ', array_filter([$d['origin'] ?? null, $d['destination'] ?? null]))),
            ],
            // Only once the email and OTP are confirmed
            'application' => $verified ? ['uid' => $application->uid] : null,
            'form' => $verified ? $this->forms->formFor($application) : null,
        ]);
    }

    private function verified(Request $request, string $uid): BookingApplication
    {
        $application = $this->share->find($uid);
        abort_unless($this->share->isVerified($request, $application), 403);

        return $application;
    }
}
