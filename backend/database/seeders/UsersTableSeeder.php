<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        // Insert sample users into the database
        User::insert([
            [
                'name' => 'Employee', // Employee account
                'email' => 'employee@gmail.com',
                'password' => Hash::make('password123'), // Hashed password for security
                'role' => 'employee', // Role assigned as 'employee'
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Customer', // Customer account
                'email' => 'customer@gmail.com',
                'password' => Hash::make('password123'), // Hashed password for security
                'role' => 'customer', // Role assigned as 'customer'
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
