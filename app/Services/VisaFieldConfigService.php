<?php

namespace App\Services;

use App\Models\Visa;
use App\Models\VisaSection;
use Illuminate\Support\Facades\DB;

class VisaFieldConfigService
{
    /**
     * Every global section and field, merged with this visa's assignments.
     * Enabled sections/fields come first in their saved order; everything
     * not assigned stays listed (unchecked) so it can still be selected.
     */
    public function configuration(Visa $visa): array
    {
        $sectionAssignments = $visa->sectionAssignments()->get()->keyBy('visa_section_id');
        $fieldAssignments = $visa->fieldAssignments()->get()->keyBy('visa_field_id');

        $sections = VisaSection::with(['fields' => fn ($query) => $query->where('status', true)->orderBy('id')])
            ->where('status', true)
            ->orderBy('id')
            ->get()
            ->map(function (VisaSection $section) use ($sectionAssignments, $fieldAssignments) {
                $assignment = $sectionAssignments->get($section->id);

                $fields = $section->fields->map(function ($field) use ($fieldAssignments) {
                    $fieldAssignment = $fieldAssignments->get($field->id);

                    return [
                        'id' => $field->id,
                        'field_name' => $field->field_name,
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
                    'fields' => $fields->map(fn ($field) => collect($field)->except('sort_order')->all())->all(),
                ];
            });

        return $sections
            ->sortBy(fn ($section) => [$section['enabled'] ? 0 : 1, $section['sort_order'] ?? PHP_INT_MAX])
            ->map(fn ($section) => collect($section)->except('sort_order')->all())
            ->values()
            ->all();
    }

    /**
     * Replace the visa's configuration with the submitted one. Only selected
     * sections and fields are sent, in display order; anything not sent is
     * deselected, so its assignment row is removed.
     *
     * @param  array<int, array{visa_section_id: int, fields?: array<int, array{visa_field_id: int, is_required?: bool}>}>  $sections
     */
    public function sync(Visa $visa, array $sections): void
    {
        DB::transaction(function () use ($visa, $sections) {
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

                    $visa->fieldAssignments()->updateOrCreate(
                        ['visa_field_id' => $field['visa_field_id']],
                        [
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
}
