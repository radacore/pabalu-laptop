<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed ACL tables first
        $this->call([
            PermissionSeeder::class,
            RoleSeeder::class,
        ]);

        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'phone' => '08123456789',
                'password' => bcrypt('password'),
            ]
        );

        // Update superadmin to have a phone number if not set
        User::where('email', 'superadmin@yuisalabs.dev')
            ->whereNull('phone')
            ->update(['phone' => '08111111111']);
    }
}
