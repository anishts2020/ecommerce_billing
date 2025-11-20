<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\User;
use App\Models\Role;
use App\Models\UserRole;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['name' => 'admin'],
            [
                'email' => 'admin@example.com',
                'password' => Hash::make('password123'),
                'is_active' => true,
            ]
        );

        $adminRole = Role::where('name', 'ADMIN')->first();

        if ($adminRole) {
            UserRole::firstOrCreate([
                'user_id' => $admin->id,
                'role_id' => $adminRole->id,
            ]);
        }
    }
}
