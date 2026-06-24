<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed admin user
        $this->call(AdminUserSeeder::class);
        $this->call(ContactInfoSeeder::class);
        $this->call(HeroImageSeeder::class);
        $this->call(SpecialOfferSeeder::class);
        $this->call(TestimonialSeeder::class);
        $this->call(TourSeeder::class);
        $this->call(VisaSeeder::class);
        $this->call(PackageSeeder::class);
    }
}
