<?php

namespace App\Services;

use App\Models\Visa;
use App\Models\VisaField;
use App\Models\VisaSection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class VisaFieldConfigService
{
    /**
     * Every global section and field, merged with this visa's assignments.
     * Enabled sections/fields come first in their saved order; everything
     * not assigned stays listed (unchecked) so it can still be selected.
     * A field moved to another section for this visa is listed there.
     */
    public function configuration(Visa $visa): array
    {
        $sectionAssignments = $visa->sectionAssignments()->get()->keyBy('visa_section_id');
        $fieldAssignments = $visa->fieldAssignments()->get()->keyBy('visa_field_id');

        $sections = VisaSection::where('status', true)->orderBy('id')->get();
        $fields = VisaField::where('status', true)->orderBy('id')->get();


        // Each field under the section it's shown in for this visa
        $bySection = $fields->groupBy(fn (VisaField $field) => $fieldAssignments->get($field->id)?->visa_section_id ?? $field->visa_section_id);

        return $sections
            ->map(function (VisaSection $section) use ($sectionAssignments, $fieldAssignments, $bySection) {
                $assignment = $sectionAssignments->get($section->id);

                $sectionFields = collect($bySection->get($section->id, []))->map(function (VisaField $field) use ($fieldAssignments) {
                    $fieldAssignment = $fieldAssignments->get($field->id);

                    return [
                        'id' => $field->id,
                        'field_name' => $field->field_name,
                        'field_type' => $field->field_type ?: 'text',
                        'options' => $this->choicesOf($field),
                        'follow_up' => $this->followUpOf($field),
                        // The section the field belongs to, before any move for this visa
                        'home_section_id' => $field->visa_section_id,
                        'enabled' => (bool) $fieldAssignment?->is_enabled,
                        'required' => (bool) $fieldAssignment?->is_required,
                        'sort_order' => $fieldAssignment?->sort_order,
                    ];
                })->sortBy(fn ($field) => [$field['enabled'] ? 0 : 1, $field['sort_order'] ?? PHP_INT_MAX])->values();

                return [
                    'id' => $section->id,
                    'section_name' => $section->section_name,
                    'enabled' => (bool) $assignment?->is_enabled,
                    'sort_order' => $assignment?->sort_order,
                    'fields' => $sectionFields->map(fn ($field) => collect($field)->except('sort_order')->all())->all(),
                ];
            })
            ->sortBy(fn ($section) => [$section['enabled'] ? 0 : 1, $section['sort_order'] ?? PHP_INT_MAX])
            ->map(fn ($section) => collect($section)->except('sort_order')->all())
            ->values()
            ->all();
    }

    /**
     * Replace the visa's configuration with the submitted one. Only selected
     * sections and fields are sent, in display order; anything not sent is
     * deselected, so its assignment row is removed. A field sent under a
     * section other than its own is moved there for this visa only.
     *
     * @param  array<int, array{visa_section_id: int, fields?: array<int, array{visa_field_id: int, is_required?: bool}>}>  $sections
     */
    public function sync(Visa $visa, array $sections): void
    {
        $homes = VisaField::pluck('visa_section_id', 'id');

        DB::transaction(function () use ($visa, $sections, $homes) {
            $sectionIds = [];
            $fieldIds = [];

            foreach (array_values($sections) as $sectionOrder => $section) {
                $sectionIds[] = $section['visa_section_id'];

                $visa->sectionAssignments()->updateOrCreate(
                    ['visa_section_id' => $section['visa_section_id']],
                    ['is_enabled' => true, 'sort_order' => $sectionOrder],
                );

                foreach (array_values($section['fields'] ?? []) as $fieldOrder => $field) {
                    $fieldIds[] = $field['visa_field_id'];
                    $moved = (int) $homes->get($field['visa_field_id']) !== (int) $section['visa_section_id'];

                    $visa->fieldAssignments()->updateOrCreate(
                        ['visa_field_id' => $field['visa_field_id']],
                        [
                            'visa_section_id' => $moved ? $section['visa_section_id'] : null,
                            'is_enabled' => true,
                            'is_required' => (bool) ($field['is_required'] ?? false),
                            'sort_order' => $fieldOrder,
                        ],
                    );
                }
            }

            $visa->sectionAssignments()->whereNotIn('visa_section_id', $sectionIds)->delete();
            $visa->fieldAssignments()->whereNotIn('visa_field_id', $fieldIds)->delete();
        });
    }

    /**
     * A new field in a section (Assign Field → Add Field). Fields are shared
     * by every visa; it starts switched on only where it was added.
     *
     * @param  array{field_name: string, field_type: string, options?: array<int, string>, follow_up?: ?array}  $data
     */
    public function createField(VisaSection $section, array $data): VisaField
    {
        return VisaField::create([
            'visa_section_id' => $section->id,
            'field_name' => $data['field_name'],
            'slug' => $this->uniqueSlug($section->id, $data['field_name']),
            'field_type' => $data['field_type'],
            'options' => $this->cleanOptions($data['field_type'], $data['options'] ?? [], $data['follow_up'] ?? null),
            'status' => true,
        ]);
    }

    /** Rename a field or change its type / options (seen by every visa that uses it). */
    public function updateField(VisaField $field, array $data): VisaField
    {
        $field->update([
            'field_name' => $data['field_name'],
            'field_type' => $data['field_type'],
            'options' => $this->cleanOptions($data['field_type'], $data['options'] ?? [], $data['follow_up'] ?? null),
        ]);

        return $field;
    }

    /** A dropdown / radio / checkbox field's choices (none for other types). */
    public function choicesOf(VisaField $field): array
    {
        return in_array($field->field_type, VisaField::CHOICE_TYPES, true) ? array_values($field->options ?? []) : [];
    }

    /**
     * A Yes / No field's follow-up section: which answer opens it and its
     * fields — ['show_when' => 'Yes', 'fields' => [['name', 'type', 'required'], …]] — or null.
     */
    public function followUpOf(VisaField $field): ?array
    {
        $options = $field->options ?? [];

        return $field->field_type === 'yesno' && ! empty($options['fields']) ? $options : null;
    }

    /**
     * What a field type stores in options: the choices for dropdown / radio /
     * checkboxes, the follow-up section for Yes / No, nothing otherwise.
     */
    private function cleanOptions(string $type, array $options, ?array $followUp = null): ?array
    {
        if ($type === 'yesno') {
            $fields = collect($followUp['fields'] ?? [])
                ->map(fn ($f) => [
                    'name' => trim((string) ($f['name'] ?? '')),
                    'type' => array_key_exists($f['type'] ?? '', VisaField::FOLLOW_UP_TYPES) ? $f['type'] : 'text',
                    'required' => (bool) ($f['required'] ?? false),
                ])
                ->filter(fn ($f) => $f['name'] !== '')
                ->unique(fn ($f) => mb_strtolower($f['name']))
                ->values()
                ->all();

            return $fields ? ['show_when' => ($followUp['show_when'] ?? 'Yes') === 'No' ? 'No' : 'Yes', 'fields' => $fields] : null;
        }

        if (! in_array($type, VisaField::CHOICE_TYPES, true)) {
            return null;
        }

        return collect($options)
            ->map(fn ($option) => trim((string) $option))
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    private function uniqueSlug(int $sectionId, string $name): string
    {
        $base = Str::slug($name, '_') ?: 'field';
        $slug = $base;
        for ($i = 2; VisaField::where('visa_section_id', $sectionId)->where('slug', $slug)->exists(); $i++) {
            $slug = "{$base}_{$i}";
        }

        return $slug;
    }
}
