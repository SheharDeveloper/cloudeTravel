<?php

namespace App\Services;

use App\Models\ApplicationForm;
use App\Models\ApplicationFormLog;
use App\Models\BookingApplication;
use App\Models\Client;
use App\Models\Country;
use App\Models\Visa;
use App\Models\VisaField;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * "Fill Application": the form for one visa application, made of the
 * sections and fields switched on for its visa (Visas → Assign Field), in
 * their configured order. Answers are saved per field; the form can be
 * saved as a draft any time, and submitting checks the required fields.
 */
class ApplicationFormService
{
    public function __construct(protected VisaFieldConfigService $fieldConfig)
    {
    }

    /** The form's sections and fields, the saved answers, and its status. */
    public function formFor(BookingApplication $application): array
    {
        $application->loadMissing('booking', 'form.answers');
        $visa = $this->visaOf($application);
        $sections = $visa ? $this->sections($visa) : [];
        $form = $application->form;

        $answers = $form
            ? $form->answers->whereNotNull('visa_field_id')->mapWithKeys(fn ($a) => [$a->visa_field_id => (string) $a->value])->all()
            : $this->prefill($application, $sections);

        // Country fields (and country fields in a Yes / No follow-up) pick from Country Management
        $hasCountry = collect($sections)->flatMap(fn ($s) => $s['fields'])->contains(fn ($f) => $f['input'] === 'country'
            || collect($f['follow_up']['fields'] ?? [])->contains('type', 'country'));

        return [
            'sections' => $sections,
            'answers' => (object) $answers,
            'status' => $form?->status,
            'submitted_at' => $form?->submitted_at?->toIso8601String(),
            'updated_at' => $form?->updated_at?->toIso8601String(),
            'visa_configured' => (bool) $visa,
            // Flags by plain path: asset() would point at the agency's own files on an agency domain
            'countries' => $hasCountry
                ? Country::orderBy('countryName')->get(['id', 'countryName', 'countryCode'])->map(fn (Country $c) => [
                    'id' => $c->id,
                    'countryName' => $c->countryName,
                    'countryCode' => $c->countryCode,
                    'flag_url' => '/assets/flags/64x48/' . strtolower((string) $c->countryCode) . '.png',
                ])->all()
                : [],
        ];
    }

    /**
     * Saves the answers. With $submit the required fields must be filled,
     * and the form is marked submitted.
     *
     * Once the form has been submitted, every changed field is written to the
     * Visa Updation Log (old and new value) as $logRole (agency | admin). The
     * fields logged by this save are on the returned form's "newLogs" relation.
     *
     * @param  array<int|string, mixed>  $answers  visa field id => value
     */
    public function save(BookingApplication $application, array $answers, bool $submit, ?object $actor, string $logRole = ApplicationFormLog::ROLE_AGENCY): ApplicationForm
    {
        $application->loadMissing('booking');
        $visa = $this->visaOf($application);
        if (! $visa) {
            throw ValidationException::withMessages(['answers' => 'This visa no longer exists, so its form cannot be filled.']);
        }

        // Only the fields switched on for this visa are taken
        $fields = collect($this->sections($visa))->flatMap(fn ($section) => collect($section['fields'])->map(fn ($field) => $field + [
            'section_id' => $section['id'],
            'section_name' => $section['name'],
        ]));

        $values = $fields->mapWithKeys(fn ($field) => [
            $field['id'] => ($v = trim((string) ($answers[$field['id']] ?? ''))) === ''
                ? null
                : match ($field['input']) {
                    'children' => $this->cleanChildren($v),
                    'checkbox' => $this->cleanCheckboxes($v, $field['options'] ?? []),
                    'select', 'radio' => in_array($v, $field['options'] ?? [], true) ? $v : null,
                    'country' => $this->cleanCountry($v),
                    'yesno_details' => $this->cleanYesNoDetails($v, $field['follow_up']),
                    'file' => $this->cleanFile($v, $application),
                    default => mb_substr($v, 0, 5000),
                },
        ]);

        // The follow-up section a Yes / No answer opened: its required fields must be filled
        $followUpErrors = $fields->filter(fn ($field) => $field['input'] === 'yesno_details' && $values[$field['id']] !== null)
            ->mapWithKeys(function ($field) use ($values) {
                $data = json_decode($values[$field['id']], true);
                if (($data['answer'] ?? null) !== $field['follow_up']['show_when']) {
                    return [];
                }
                $missing = collect($field['follow_up']['fields'])
                    ->first(fn ($f) => $f['required'] && trim((string) ($data['details'][$f['name']] ?? '')) === '');

                return $missing ? ["answers.{$field['id']}" => "{$missing['name']} is required."] : [];
            });
        if ($submit && $followUpErrors->isNotEmpty()) {
            throw ValidationException::withMessages($followUpErrors->all());
        }

        // "Yes" to children needs every child's name
        $childErrors = $fields->filter(fn ($field) => $field['input'] === 'children' && $values[$field['id']] !== null)
            ->mapWithKeys(function ($field) use ($values) {
                $data = json_decode($values[$field['id']], true);
                $unnamed = ($data['has'] ?? '') === 'yes'
                    && (empty($data['children']) || collect($data['children'])->contains(fn ($c) => trim($c['name'] ?? '') === ''));

                return $unnamed ? ["answers.{$field['id']}" => 'Enter the name of each child, or choose No.'] : [];
            });
        if ($submit && $childErrors->isNotEmpty()) {
            throw ValidationException::withMessages($childErrors->all());
        }

        if ($submit) {
            $missing = $fields->filter(fn ($field) => $field['required'] && $values[$field['id']] === null);
            if ($missing->isNotEmpty()) {
                throw ValidationException::withMessages(
                    $missing->mapWithKeys(fn ($field) => ["answers.{$field['id']}" => "{$field['name']} is required."])->all()
                );
            }
        }

        return DB::transaction(function () use ($application, $visa, $fields, $values, $submit, $actor, $logRole) {
            $form = $application->form()->firstOrCreate([], ['visa_id' => $visa->id]);

            // Changes to a submitted form go to the Visa Updation Log
            $logs = collect();
            if ($form->status === ApplicationForm::STATUS_SUBMITTED) {
                $old = $form->answers()->whereNotNull('visa_field_id')->pluck('value', 'visa_field_id');
                $logs = $fields->filter(fn ($field) => ($old[$field['id']] ?? null) !== $values[$field['id']])
                    ->map(fn ($field) => $application->formLogs()->create([
                        'visa_field_id' => $field['id'],
                        'section_name' => $field['section_name'],
                        'field_name' => $field['name'],
                        'field_slug' => $field['slug'],
                        'old_value' => $this->displayValue($field['input'], $old[$field['id']] ?? null),
                        'new_value' => $this->displayValue($field['input'], $values[$field['id']]),
                        'changed_by_role' => $logRole,
                        'changed_by_type' => $actor ? get_class($actor) : null,
                        'changed_by_id' => $actor?->id,
                    ]))
                    ->values();
            }

            $form->answers()->delete();
            $form->answers()->createMany($fields->values()->map(fn ($field, $order) => [
                'visa_section_id' => $field['section_id'],
                'visa_field_id' => $field['id'],
                'section_name' => $field['section_name'],
                'field_name' => $field['name'],
                'field_slug' => $field['slug'],
                'value' => $values[$field['id']],
                'sort_order' => $order,
            ])->filter(fn ($row) => $row['value'] !== null)->values()->all());

            $form->update([
                'visa_id' => $visa->id,
                'status' => $submit ? ApplicationForm::STATUS_SUBMITTED : ($form->status ?? ApplicationForm::STATUS_DRAFT),
                'submitted_at' => $submit ? now() : $form->submitted_at,
                'updated_by_type' => $actor ? get_class($actor) : null,
                'updated_by_id' => $actor?->id,
            ]);

            return $form->refresh()->setRelation('newLogs', $logs);
        });
    }

    /** An answer as the log shows it: "Yes: Riya, Aman" for children, "A, B" for checkboxes, the file's name. */
    private function displayValue(string $input, ?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        return match ($input) {
            'children' => (function () use ($value) {
                $data = json_decode($value, true) ?? [];
                $names = collect($data['children'] ?? [])->pluck('name')->filter()->implode(', ');

                return ($data['has'] ?? '') === 'yes' ? 'Yes' . ($names !== '' ? ": {$names}" : '') : 'No';
            })(),
            'checkbox' => implode(', ', json_decode($value, true) ?? []),
            'file' => json_decode($value, true)['name'] ?? $value,
            // "Yes — Reason: Work trip; Date: 2026-11-01"
            'yesno_details' => (function () use ($value) {
                $data = json_decode($value, true) ?? ['answer' => $value];
                $details = collect($data['details'] ?? [])->map(fn ($v, $k) => "{$k}: {$v}")->implode('; ');

                return ($data['answer'] ?? '') . ($details !== '' ? " — {$details}" : '');
            })(),
            default => $value,
        };
    }

    /**
     * A children answer, kept to its known shape:
     * {"has": "yes"|"no", "children": [{name, dob, nationality, address}, …]}.
     * Anything unreadable is dropped.
     */
    private function cleanChildren(string $value): ?string
    {
        $data = json_decode($value, true);
        if (! is_array($data) || ! in_array($data['has'] ?? null, ['yes', 'no'], true)) {
            return null;
        }

        $children = $data['has'] === 'yes'
            ? collect($data['children'] ?? [])
                ->filter(fn ($c) => is_array($c))
                ->take(20)
                ->map(fn ($c) => collect(['name', 'dob', 'nationality', 'address'])
                    ->mapWithKeys(fn ($key) => [$key => mb_substr(trim((string) ($c[$key] ?? '')), 0, 500)])
                    ->all())
                ->values()
                ->all()
            : [];

        return json_encode(['has' => $data['has'], 'children' => $children], JSON_UNESCAPED_UNICODE);
    }

    /** A country answer: one of the countries in Country Management (its name). */
    private function cleanCountry(string $value): ?string
    {
        return Country::where('countryName', $value)->value('countryName');
    }

    /**
     * A Yes / No answer with a follow-up section, kept to its shape:
     * {"answer": "Yes"|"No", "details": {"Reason": "…", …}}. The details are
     * kept only when the answer opens the section. A plain "Yes" / "No"
     * (saved before the field had a follow-up) is read as the answer.
     */
    private function cleanYesNoDetails(string $value, array $followUp): ?string
    {
        $data = json_decode($value, true);
        if (! is_array($data)) {
            $data = ['answer' => $value];
        }
        $answer = in_array($data['answer'] ?? null, ['Yes', 'No'], true) ? $data['answer'] : null;
        if (! $answer) {
            return null;
        }

        $details = [];
        if ($answer === $followUp['show_when']) {
            foreach ($followUp['fields'] as $f) {
                $v = trim((string) ($data['details'][$f['name']] ?? ''));
                if ($v === '') {
                    continue;
                }
                $v = $f['type'] === 'country' ? $this->cleanCountry($v) : mb_substr($v, 0, 5000);
                if ($v !== null) {
                    $details[$f['name']] = $v;
                }
            }
        }

        return json_encode(['answer' => $answer, 'details' => (object) $details], JSON_UNESCAPED_UNICODE);
    }

    /** Checkboxes: a JSON list of the ticked options, only real options kept. */
    private function cleanCheckboxes(string $value, array $options): ?string
    {
        $ticked = array_values(array_intersect($options, (array) json_decode($value, true)));

        return $ticked ? json_encode($ticked, JSON_UNESCAPED_UNICODE) : null;
    }

    /**
     * File upload: {"path": …, "name": …}. The path must be one uploaded for
     * this application (see storeFile), so no other file can be referenced.
     */
    private function cleanFile(string $value, BookingApplication $application): ?string
    {
        $data = json_decode($value, true);
        $path = is_array($data) ? (string) ($data['path'] ?? '') : '';

        if (! $this->ownsFile($application, $path)) {
            return null;
        }

        return json_encode([
            'path' => $path,
            'name' => mb_substr(basename((string) ($data['name'] ?? basename($path))), 0, 200),
        ], JSON_UNESCAPED_UNICODE);
    }

    /** Where an application's uploaded files live (private disk). */
    public function fileFolder(BookingApplication $application): string
    {
        return "application-forms/{$application->uid}";
    }

    public function ownsFile(BookingApplication $application, string $path): bool
    {
        return $path !== ''
            && str_starts_with($path, $this->fileFolder($application) . '/')
            && ! str_contains($path, '..')
            && \Illuminate\Support\Facades\Storage::disk('local')->exists($path);
    }

    /** Stores an uploaded answer file privately; returns the answer value for the field. */
    public function storeFile(BookingApplication $application, \Illuminate\Http\UploadedFile $file): string
    {
        $path = $file->store($this->fileFolder($application), 'local');

        return json_encode(['path' => $path, 'name' => mb_substr($file->getClientOriginalName(), 0, 200)], JSON_UNESCAPED_UNICODE);
    }

    private function visaOf(BookingApplication $application): ?Visa
    {
        $uid = $application->booking->details['visa_uid'] ?? null;

        return $uid ? Visa::where('uid', $uid)->first() : null;
    }

    /** The visa's switched-on sections, each with its switched-on fields, in order. */
    private function sections(Visa $visa): array
    {
        $slugs = VisaField::pluck('slug', 'id');

        return collect($this->fieldConfig->configuration($visa))
            ->where('enabled', true)
            ->map(fn ($section) => [
                'id' => $section['id'],
                'name' => $section['section_name'],
                'step' => $this->stepOf($section['section_name']),
                'fields' => collect($section['fields'])
                    ->where('enabled', true)
                    ->map(fn ($field) => [
                        'id' => $field['id'],
                        'name' => $field['field_name'],
                        'slug' => $slugs[$field['id']] ?? Str::slug($field['field_name'], '_'),
                        'required' => $field['required'],
                    ] + $this->inputFor($field['field_name'], $field['field_type'] ?? 'text', $field['options'] ?? [], $field['follow_up'] ?? null))
                    ->values()
                    ->all(),
            ])
            ->filter(fn ($section) => count($section['fields']) > 0)
            ->values()
            ->all();
    }

    /**
     * Which of the form's steps a section belongs to: 1 Personal Info (who
     * the applicant is) or 2 Travel Details (the trip, its purpose and who
     * pays). Step 3 is the review of both.
     */
    private function stepOf(string $sectionName): int
    {
        return preg_match('/travel|visa|trip|accommodation|host|sponsor|invit|financ|medical|student|insurance/i', $sectionName) ? 2 : 1;
    }

    /**
     * Which input a field gets. A field type set on the field wins; plain
     * "text" fields are read from their name (dates, emails, phones, long
     * answers, a few fixed choices, and "… Section" sub-headings).
     */
    private function inputFor(string $name, string $type, array $options = [], ?array $followUp = null): array
    {
        if ($type !== 'text' && $type !== '') {
            return match ($type) {
                'select', 'radio', 'checkbox' => ['input' => $type, 'options' => array_values($options)],
                // Yes / No; with a follow-up section, the chosen answer opens more fields (e.g. "Reason")
                'yesno' => $followUp
                    ? ['input' => 'yesno_details', 'options' => ['Yes', 'No'], 'follow_up' => $followUp]
                    : ['input' => 'radio', 'options' => ['Yes', 'No']],
                default => ['input' => $type], // textarea, number, email, tel, date, country, file
            };
        }

        $n = Str::lower($name);
        $choices = [
            'title' => ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr'],
            'gender' => ['Male', 'Female', 'Other'],
            'marital status' => ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'],
        ];

        return match (true) {
            isset($choices[$n]) => ['input' => 'select', 'options' => $choices[$n]],
            // "Children Section": Do you have a child? Yes/No, then one entry per child
            str_contains($n, 'child') && str_ends_with($n, ' section') => ['input' => 'children'],
            str_ends_with($n, ' section') => ['input' => 'heading'],
            str_contains($n, 'dob') || str_starts_with($n, 'date of') || str_contains($n, 'arrival date') || str_contains($n, 'departure date') => ['input' => 'date'],
            str_contains($n, 'email') => ['input' => 'email'],
            str_contains($n, 'phone') || str_contains($n, 'contact number') => ['input' => 'tel'],
            (bool) preg_match('/address|history|itinerary|details|information|questions|letter|places|qualifications|marks/', $n) => ['input' => 'textarea'],
            default => ['input' => 'text'],
        };
    }

    /**
     * A new form starts with what is already known about the applicant, and
     * only that: the booking, plus the client's record for the client
     * themself (Self) or the family member's record for a family member.
     * Anything not on record stays empty.
     */
    private function prefill(BookingApplication $application, array $sections): array
    {
        $booking = $application->booking;
        $d = $booking->details ?? [];
        $date = fn ($value) => $value ? \Illuminate\Support\Carbon::parse($value)->toDateString() : null;

        $known = [
            'full_name' => trim("{$application->first_name} {$application->last_name}"),
            'email_address' => $application->email,
            'phone_number_mobile' => $application->phone,
            'passport_number' => $application->passport_number,
            'country_of_citizenship' => $application->nationality,
            'citizenship' => $application->nationality,
            'main_destination_country' => $d['destination'] ?? null,
            'visa_type' => $d['visa_type'] ?? null,
            'intended_arrival_date' => $booking->service_date?->toDateString(),
        ];

        // The client's full record (the page may have loaded only a few of its columns)
        $client = $booking->client_id ? Client::with('address', 'passport')->find($booking->client_id) : null;
        $isSelf = $client && ! $application->client_family_member_id && $application->relation === 'self';

        if ($isSelf) {
            $address = $client->address;
            $passport = $client->passport;
            $known += [
                'gender' => $client->gender ? ucfirst(strtolower($client->gender)) : null,
                'date_of_birth' => $date($client->dob),
                'nationality_at_birth' => $client->nationality,
                'current_residential_address' => $address?->address,
                'permanent_residential_address' => $address?->address,
                'city' => $address?->city,
                'state' => $address?->state,
                'postal_code' => $address?->zip_code,
                'country_of_residence' => $address?->country,
                'place_of_issue' => $passport?->place_of_issue,
                'date_of_issue' => $date($passport?->date_of_issue),
                'date_of_expiry' => $date($passport?->expiry_date),
            ];
            $known['email_address'] = $known['email_address'] ?: $client->email;
            $known['phone_number_mobile'] = $known['phone_number_mobile'] ?: $client->phone;
            $known['passport_number'] = $known['passport_number'] ?: $passport?->passport_number;
        } elseif ($client && $application->client_family_member_id) {
            $member = $client->familyMembers()->find($application->client_family_member_id);
            $known += [
                'date_of_birth' => $date($member?->dob),
                'place_of_issue' => $member?->place_of_issue,
                'date_of_issue' => $date($member?->date_of_issue),
                'date_of_expiry' => $date($member?->expiry_date),
            ];
            $known['passport_number'] = $known['passport_number'] ?: $member?->passport_number;
        }

        $answers = [];
        foreach ($sections as $section) {
            foreach ($section['fields'] as $field) {
                if (! empty($known[$field['slug']])) {
                    $answers[$field['id']] = (string) $known[$field['slug']];
                }
            }
        }

        return $answers;
    }
}
