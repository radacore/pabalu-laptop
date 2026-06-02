<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // User management
            ['name' => 'view-users', 'description' => 'View list of users and their details'],
            ['name' => 'create-users', 'description' => 'Create new user accounts'],
            ['name' => 'edit-users', 'description' => 'Edit existing user information'],
            ['name' => 'delete-users', 'description' => 'Delete user accounts'],

            // Role management
            ['name' => 'view-roles', 'description' => 'View available roles and their permissions'],
            ['name' => 'create-roles', 'description' => 'Create new roles'],
            ['name' => 'edit-roles', 'description' => 'Edit role names and permissions'],
            ['name' => 'delete-roles', 'description' => 'Delete roles'],

            // Permission management
            ['name' => 'view-permissions', 'description' => 'View all available permissions'],
            ['name' => 'create-permissions', 'description' => 'Create new permissions'],
            ['name' => 'edit-permissions', 'description' => 'Edit existing permissions'],
            ['name' => 'delete-permissions', 'description' => 'Delete permissions'],

            // Customer management
            ['name' => 'view-customers', 'description' => 'View list of customers'],
            ['name' => 'create-customers', 'description' => 'Create new customer accounts'],
            ['name' => 'edit-customers', 'description' => 'Edit customer information'],
            ['name' => 'delete-customers', 'description' => 'Delete customer accounts'],

            // Laptop management
            ['name' => 'view-laptops', 'description' => 'View laptop inventory'],
            ['name' => 'create-laptops', 'description' => 'Add new laptop to inventory'],
            ['name' => 'edit-laptops', 'description' => 'Edit laptop information'],
            ['name' => 'delete-laptops', 'description' => 'Remove laptop from inventory'],

            // Service management
            ['name' => 'view-services', 'description' => 'View service records'],
            ['name' => 'create-services', 'description' => 'Create new service record'],
            ['name' => 'edit-services', 'description' => 'Edit service information'],
            ['name' => 'delete-services', 'description' => 'Delete service records'],

            // Transaction management
            ['name' => 'view-transactions', 'description' => 'View financial transactions'],
            ['name' => 'create-transactions', 'description' => 'Create manual transactions'],
            ['name' => 'edit-transactions', 'description' => 'Edit transaction details'],
            ['name' => 'delete-transactions', 'description' => 'Delete transactions'],

            // Reports
            ['name' => 'view-reports', 'description' => 'View business reports'],
            ['name' => 'export-reports', 'description' => 'Export reports to file'],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission['name']],
                [
                    'description' => $permission['description'],
                    'guard_name' => 'web',
                ]
            );
        }

        $this->command->info('Permissions seeded successfully!');
    }
}
