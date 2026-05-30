<?php

namespace Database\Factories;

use App\Models\Agency;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Agency>
 */
class AgencyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'agency_name' => fake()->company(),
            'legal_name' => fake()->company() . ' Ltd.',
            'email' => fake()->unique()->companyEmail(),
            'phone_number' => fake()->phoneNumber(),
            'alternate_phone' => fake()->phoneNumber(),
            'country' => fake()->country(),
            'state' => fake()->state(),
            'city' => fake()->city(),
            'postal_code' => fake()->postcode(),
            'address' => fake()->address(),
            'registration_number' => fake()->numerify('REG-#####'),
            'gst_number' => fake()->numerify('GST####################'),
            'pan_number' => fake()->numerify('PAN##########'),
            'account_number' => fake()->bankAccountNumber(),
            'ifsc_code' => fake()->numerify('IFSC0######'),
            'note' => fake()->text(),
            'tax_status' => 1,
        ];
    }
}
