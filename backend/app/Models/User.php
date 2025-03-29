<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = ['name', 'email', 'password', 'role'];

    protected $hidden = ['password'];

    // A user can have multiple orders
    public function orders() {
        return $this->hasMany(Order::class);
    }

    // A user can have multiple items in their cart
    public function cart() {
        return $this->hasMany(Cart::class);
    }
}
