<?php

namespace Database\Seeders;

use App\Models\VisaServiceCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VisaServiceCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (['Tourism & Business', 'Work & Immigration'] as $name) {
            VisaServiceCategory::firstOrCreate(['name' => $name]);
        }
    }
}
