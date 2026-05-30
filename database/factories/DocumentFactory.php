<?php

namespace Database\Factories;

use App\Models\Document;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Document>
 */
class DocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'agency_document_id' => \App\Models\AgencyDocument::factory(),
            'document_name' => fake()->word() . '.pdf',
            'path' => 'documents/' . fake()->uuid() . '.pdf',
            'size' => fake()->numerify('####'),
        ];
    }
}
