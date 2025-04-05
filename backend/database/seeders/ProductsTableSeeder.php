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
                'name' => 'iPhone 15 Pro Max',
                'description' => 'Apple\'s latest flagship with a titanium frame, A17 Pro chip, and 48MP camera.',
                'price' => 1299.99 * 56.30,
                'stock' => 10,
                'image' => 'https://www.trikart.com/media/catalog/product/a/p/apple_iphone_15_pro_max_gold-1.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Samsung Galaxy S24 Ultra',
                'description' => 'Premium Android smartphone with a 200MP camera, Snapdragon 8 Gen 3, and S Pen support.',
                'price' => 1199.99 * 56.30,
                'stock' => 8,
                'image' => 'https://th.bing.com/th/id/OIP.093zupXXBLNf4tZfTv_bMAHaEK?rs=1&pid=ImgDetMain',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Google Pixel 8 Pro',
                'description' => 'AI-powered smartphone with Google Tensor G3 chip, pro-level camera, and stock Android experience.',
                'price' => 999.99 * 56.30,
                'stock' => 6,
                'image' => 'https://m.media-amazon.com/images/I/713eEl39eLL._AC_SL1500_.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'OnePlus 12 Pro',
                'description' => 'Fast and powerful device with a 120Hz AMOLED display, Snapdragon 8 Gen 3, and Hasselblad cameras.',
                'price' => 899.99 * 56.30,
                'stock' => 5,
                'image' => 'https://th.bing.com/th/id/OIP.WQhUwGjGyqkB6zzVCrDcFwHaHa?rs=1&pid=ImgDetMain',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Xiaomi 14 Ultra',
                'description' => 'Flagship killer with a Leica-powered camera system, 5000mAh battery, and 120W fast charging.',
                'price' => 799.99 * 56.30,
                'stock' => 7,
                'image' => 'https://th.bing.com/th/id/OIP.u0SVzYi_iH1bEGPUMO5IzQHaEI?rs=1&pid=ImgDetMain',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sony Xperia 1 V',
                'description' => 'Professional-grade smartphone with a 4K OLED display, Snapdragon 8 Gen 2, and advanced audio features.',
                'price' => 1099.99 * 56.30,
                'stock' => 4,
                'image' => 'https://static1.anpoimages.com/wordpress/wp-content/uploads/2023/06/sony-xperia-1-v-review-wmfixed-15.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Asus ROG Phone 8',
                'description' => 'Gaming beast with 165Hz AMOLED screen, Snapdragon 8 Gen 3, and AirTrigger controls.',
                'price' => 1199.99 * 56.30,
                'stock' => 3,
                'image' => 'https://th.bing.com/th/id/OIP.3jxJ1IR-pCbblDcUURAG_gHaEK?rs=1&pid=ImgDetMain',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Nothing Phone (2)',
                'description' => 'Minimalist smartphone with transparent design, Glyph Interface, and Snapdragon 8+ Gen 1.',
                'price' => 699.99 * 56.30,
                'stock' => 9,
                'image' => 'https://www.lowyat.net/wp-content/uploads/2023/07/Nothing-Phone-2-now-official-3.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
