<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductsTableSeeder extends Seeder
{
    public function run()
    {
        Product::insert([
            [
                'name' => 'Laptop',
                'description' => 'High-performance laptop with 16GB RAM and 512GB SSD.',
                'price' => 799.99,
                'stock' => 10,
                'image' => 'https://th.bing.com/th/id/OIP.KFUvmuY519ADxrYvi1hcJgHaFc?rs=1&pid=ImgDetMain',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Smartphone',
                'description' => 'Latest smartphone with 128GB storage and AMOLED display.',
                'price' => 499.99,
                'stock' => 15,
                'image' => 'https://th.bing.com/th/id/OIP.CRBBGZZzyJGhWrt1kCbRQQHaHa?rs=1&pid=ImgDetMain',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
