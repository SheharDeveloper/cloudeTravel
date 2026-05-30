<?php

namespace Database\Factories;

use App\Models\AgencyDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AgencyDocument>
 */
class AgencyDocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'agency_id' => \App\Models\Agency::factory(),
            'document_name' => fake()->word() . ' Document',
            'document_type' => fake()->randomElement(['GST', 'PAN', 'Bank Statement', 'License']),
            'document_master_id' => null,
            'upload_status' => 1,
        ];
    }
}
