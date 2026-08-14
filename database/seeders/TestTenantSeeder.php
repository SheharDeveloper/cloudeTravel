<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Models\Domain;
use Illuminate\Database\Seeder;

class TestTenantSeeder extends Seeder
{
    public function run(): void
    {
        // Create test tenant
        $tenant = Tenant::updateOrCreate(
            ['slug' => 'test1'],
            [
                'name' => 'Test Agency',
                'status' => 'active',
                'plan' => 'premium',
            ]
        );

        // Create domain for test tenant
        Domain::updateOrCreate(
            ['domain' => 'test1.localhost'],
            [
                'tenant_id' => $tenant->id,
                'type' => 'subdomain',
                'is_primary' => true,
                'verified_at' => now(),
                'ssl_status' => 'active',
            ]
        );

        $this->command->info('Test tenant created successfully!');
        $this->command->table(['Slug', 'Name', 'Domain'], [
            ['test1', 'Test Agency', 'test1.localhost'],
        ]);
    }
}
