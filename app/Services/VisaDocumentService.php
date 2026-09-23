<?php

namespace App\Services;

use App\Models\Visa;
use Illuminate\Support\Facades\DB;

class VisaDocumentService
{
    public function forVisa(Visa $visa): array
    {
        return $visa->documents()->orderBy('sort_order')->orderBy('id')
            ->get(['id', 'name', 'description', 'is_required'])
            ->all();
    }

    /**
     * The form submits the visa's complete document list in display order.
     * Rows carrying an id are updated, new rows are created, and stored
     * rows that were not submitted are removed.
     *
     * @param  array<int, array{id?: int|null, name: string, description?: ?string, is_required?: bool}>  $documents
     */
    public function sync(Visa $visa, array $documents): void
    {
        DB::transaction(function () use ($visa, $documents) {
            $keptIds = [];

            foreach (array_values($documents) as $order => $row) {
                $attributes = [
                    'name' => trim($row['name']),
                    'description' => $row['description'] ?? null,
                    'is_required' => (bool) ($row['is_required'] ?? false),
                    'sort_order' => $order,
                ];

                $document = !empty($row['id']) ? $visa->documents()->find($row['id']) : null;

                if ($document) {
                    $document->update($attributes);
                } else {
                    $document = $visa->documents()->create($attributes);
                }

                $keptIds[] = $document->id;
            }

            $visa->documents()->whereNotIn('id', $keptIds)->delete();
        });
    }
}
