<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'total_price', 'status','checkout_date'];

    // An order belongs to a user
    public function user() {
        return $this->belongsTo(User::class);   
    }

    // An order can have multiple order items
    public function items() {
        return $this->hasMany(OrderItem::class);
    }
}
