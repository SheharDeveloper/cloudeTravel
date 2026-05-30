<?php

namespace Database\Seeders;

use App\Models\SpecialOffer;
use Illuminate\Database\Seeder;

class SpecialOfferSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SpecialOffer::create([
            'airline' => 'ETIHAD AIRWAYS',
            'from' => 'LONDON',
            'destinations' => 'destinations worldwide',
            'price' => '£495.00',
            'description' => 'Special fares with ETIHAD AIRWAYS from LONDON to destinations worldwide',
        ]);

        SpecialOffer::create([
            'airline' => 'EMIRATES',
            'from' => 'MANCHESTER',
            'destinations' => 'Dubai & Middle East',
            'price' => '£575.00',
            'description' => 'Exclusive Emirates flights from Manchester to Dubai and across the Middle East',
        ]);

        SpecialOffer::create([
            'airline' => 'QATAR AIRWAYS',
            'from' => 'LONDON',
            'destinations' => 'Asia & Far East',
            'price' => '£625.00',
            'description' => 'Premium Qatar Airways service to Asia with complimentary meals and entertainment',
        ]);
    }
}
